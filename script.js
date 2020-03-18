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

  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
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

// вызовы функций

// getData(citiesLocalBD, (data) => {
getData(proxy + CITY_API, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});
