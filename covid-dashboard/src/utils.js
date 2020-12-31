import ReactDOM from 'react-dom';
import { countryNames } from './data/countries.js';
import { badCountries } from './data/badCountries';
import { MAIN_URL, MODES, ERROR_REPEAT_TIME } from './constants';

export function countryName(country) {
    for (const item of countryNames) {
      if (!item.possibleNames) item.possibleNames = [];
      if (country === item.name || item.possibleNames.includes(country)) return item.name;
    }
    return '';
}

export function toggleApiState(key, value) {
    if(!key) return false;
    const country = (key === 'country');
    const newState = {...this.state};
    newState[key] = (country) ? countryName(value) : value;
    this.setState(newState);
}

export function toggleFullScreen(event) {
  const parentComponent = ReactDOM.findDOMNode(event.target).parentNode;
  parentComponent.classList.toggle('fullscreen');
  const newState = {...this.state};
  newState.fullscreen = !newState.fullscreen;
  this.setState(newState);
}

const fetchCache = {};

function fetchData(query, resultCallBack, errorCallBack) {
  const url = `${MAIN_URL}${query}`;
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
    setTimeout(() => fetchData(query, resultCallBack, errorCallBack), ERROR_REPEAT_TIME);
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

export function fetchAll(child, url = '') {
  const query = `${url}?allowNull=false`;
  fetchData(query, resultCallBack.bind(child), errorCallBack.bind(child));
}


export function fetchCountry(child, url = '', countryFilter = true) {
  const sort = MODES[this.state.sortIndex];
  const prefix = (url) ? `${url}` : '';
  const country = (this.state.country && countryFilter) ? `/${this.state.country}` : '';
  const postfix = (url || country) ? '?' : '';
  const query = `${prefix}${country}${postfix}sort=${sort}&allowNull=false`;
  fetchData(query, resultCallBack.bind(child), errorCallBack.bind(child));
}

export function fetchHistory(child, url = '', countryFilter = true) {
  const prefix = (url) ? url : '';
  let country = (this.state.country && countryFilter) ? `${this.state.country}` : 'all';
  if (badCountries.includes(country)) country = 'all';
  const query = `${prefix}/${country}?lastdays=all`;
  fetchData(query, resultCallBack.bind(child), errorCallBack.bind(child));
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
