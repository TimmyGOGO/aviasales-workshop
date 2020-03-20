console.log('Привет, друзья!');

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');

// константы для подгрузки данных:
const CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',
  citiesLocalBD = 'dataBase/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '1ed3ba2e1f02eb124524399a74893911',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// const city = ['Москва', 'Санкт-Петербург', 'Тверь', 'Минск'];
let city = [];

// функции:

const getData = (url, callback, reject = console.error) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);
  request.addEventListener('readystatechange', (event) => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      reject(request.status);
    }
  });
  request.send();
};

const compareCitiesByAlphabet = (city1, city2) => {
  if (city1.name < city2.name) {
    return -1;
  }

  if (city1.name === city2.name) {
    return 0;
  }

  if (city1.name > city2.name) {
    return 1;
  }
};

const showCity = (input, list) => () => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase();

  if (inputValue !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(inputValue);
    });

    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
      console.log(li);
    });
  }
};

const selectCity = (input, list) => (event) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.innerText;
    list.textContent = '';
  }
};

const getNameCity = (code) => {
  const objCity = city.find((item) => item.code === code);
  return objCity.name;
};

const getDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getChanges = (num) => {
  if (num) {
    return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
};

const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
      <h3 class="agent">${data.gate}</h3>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
            за ${data.value}₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города:
              <span class="city__name">${getNameCity(data.origin)}</span>
            </div>
            <div class="date">${getDate(data.depart_date)}</div>
          </div>

          <div class="block-right">
            <div class="changes">${getChanges(data.number_of_changes)}</div>
            <div class="city__to">Город назначения:
              <span class="city__name">${getNameCity(data.destination)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    deep = '<h3>К сожалению на текущую дату билетов не нашлось</h3>';
  }

  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
  const ticket = createCard(cheapTicket ? cheapTicket[0] : null);
  cheapestTicket.append(ticket);
};

const compareTicketsInAscendingPriceOrder = (ticket1, ticket2) =>
  ticket1.value - ticket2.value;

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
  if (cheapTickets) {
    const sortedCheapTickets = cheapTickets.sort(
      compareTicketsInAscendingPriceOrder
    );
    sortedCheapTickets.forEach((cheapTicket) => {
      const ticket = createCard(cheapTicket);
      otherCheapTickets.append(ticket);
    });
    console.log({ sortedCheapTickets });
  }
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter(
    (item) => item.depart_date === date
  );

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

const renderError = (error) => {
  alert('В этм направлении нет рейсов', error);

  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
  cheapestTicket.append(createCard(null));

  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
  otherCheapTickets.append(createCard(null));
};

// обработчики событий:
inputCitiesFrom.addEventListener(
  'input',
  showCity(inputCitiesFrom, dropdownCitiesFrom)
);

inputCitiesTo.addEventListener(
  'input',
  showCity(inputCitiesTo, dropdownCitiesTo)
);

dropdownCitiesFrom.addEventListener(
  'click',
  selectCity(inputCitiesFrom, dropdownCitiesFrom)
);

dropdownCitiesTo.addEventListener(
  'click',
  selectCity(inputCitiesTo, dropdownCitiesTo)
);

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value
  };
  console.log(formData);

  if (formData.from && formData.to) {
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;
    console.log({ requestData });

    getData(
      calendar + requestData,
      (response) => {
        renderCheap(response, formData.when);
      },
      (error) => {
        renderError(error);
      }
    );
  } else {
    alert('Введите корректное название города!');
  }
});

// вызовы функций

// getData(citiesLocalBD, (data) => {
getData(proxy + CITY_API, (data) => {
  city = JSON.parse(data)
    .filter((item) => item.name)
    .sort(compareCitiesByAlphabet);
});
