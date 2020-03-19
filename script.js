console.log('Привет, друзья!');

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart');

// константы для подгрузки данных:
const CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',
  citiesLocalBD = 'dataBase/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '1ed3ba2e1f02eb124524399a74893911',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// const city = ['Москва', 'Санкт-Петербург', 'Тверь', 'Минск'];
let city = [];

// функции:

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);
  request.addEventListener('readystatechange', (event) => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });
  request.send();
};

const showCity = (input, list) => () => {
  list.textContent = '';
  const inputValue = input.value.toLowerCase();

  if (inputValue !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(inputValue) && fixItem.startsWith(inputValue);
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

const renderCheapDay = (cheapTicket) => {
  console.log({ cheapTicket });
};

const renderCheapYear = (cheapTickets) => {
  console.log({ cheapTickets });
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter(
    (item) => item.depart_date === date
  );

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
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
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  };
  console.log(formData);

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;
  console.log({ requestData });

  getData(calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });
});

// вызовы функций

// getData(citiesLocalBD, (data) => {
getData(proxy + CITY_API, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});
