import ReactDOM from 'react-dom';
import { countryNames } from './data/countries.js';
import { badCountries } from './data/badCountries';
import { MAIN_URL, NEWS_URL, MODES, ERROR_REPEAT_TIME } from './constants';

export function countryName(country) {
    for (const item of countryNames) {
      if (!item.possibleNames) item.possibleNames = [];
      if (country === item.name || item.possibleNames.includes(country)) return item.name;
    }
    return '';
}

export function toggleApiState(key, value) {
    if(!key) return false;
    this.setState((state) => {
      state[key] = (key === 'country') ? countryName(value) : value;
      return state;
    });
}

export function toggleFullScreen(event) {
  const parentComponent = ReactDOM.findDOMNode(event.target).parentNode;
  parentComponent.classList.toggle('fullscreen');
  this.setState((state) => {
    state.fullscreen = !state.fullscreen;
    return state;
  });
}

const fetchCache = {};

function fetchData(url, resultCallBack, errorCallBack) {
  const key = JSON.stringify(url);
  if (fetchCache[key]) {
    resultCallBack(JSON.parse(fetchCache[key]));
    return;
  }
  
  fetch(url)
  .then(response => response.json())
  .then(result => {
    fetchCache[key] = JSON.stringify(result);
    resultCallBack(result)
  })
  .catch(error => {
    errorCallBack(error);
    setTimeout(() => fetchData(url, resultCallBack, errorCallBack), ERROR_REPEAT_TIME);
  });
}

function resultCallBack(result) {
  const newState = {...this.state};
  newState.isLoaded = true;
  if (newState.error) newState.error = undefined;
  newState.items = result;
  this.setState(newState);
}

function errorCallBack(error) {
  const newState = {...this.state};
  newState.isLoaded = true;
  newState.error = error;
  this.setState(newState);
}

export function fetchAll(child, query = '') {
  const url = `${MAIN_URL}${query}?allowNull=false`;
  fetchData(url, resultCallBack.bind(child), errorCallBack.bind(child));
}


export function fetchCountry(child, query = '', countryFilter = true) {
  const sort = MODES[this.state.sortIndex];
  const prefix = (query) ? `${query}` : '';
  const country = (this.state.country && countryFilter) ? `/${this.state.country}` : '';
  const postfix = (query || country) ? '?' : '';
  const url = `${MAIN_URL}${prefix}${country}${postfix}sort=${sort}&allowNull=false`;
  fetchData(url, resultCallBack.bind(child), errorCallBack.bind(child));
}

export function fetchHistory(child, query = '', countryFilter = true) {
  const prefix = (query) ? query : '';
  let country = (this.state.country && countryFilter) ? `${this.state.country}` : 'all';
  if (badCountries.includes(country)) country = 'all';
  const url = `${MAIN_URL}${prefix}/${country}?lastdays=all`;
  fetchData(url, resultCallBack.bind(child), errorCallBack.bind(child));
}

export function fetchNews(child) {
  fetchData(NEWS_URL, resultCallBack.bind(child), errorCallBack.bind(child));
}

export function chooseSort(sort = '') {
  const prefix = (this.state.today) ? 'today' : '';
  const sortType = sort || MODES[this.state.sortIndex];
  const postfix = (this.state.today) ? sortType.slice(0, 1).toUpperCase().concat(sortType.slice(1)) : sortType;
  return `${prefix}${postfix}`;
}

export function formatCounter(counter = 0, population = 100000) {
  let count = (this.state.per100k) ? Math.round(counter / (population / 100000)) : counter;
  if (count === Infinity || isNaN(count)) count = 0;
  return count;
}
