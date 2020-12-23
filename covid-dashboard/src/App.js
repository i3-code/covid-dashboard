import './App.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header/Header';
import Left from './components/Left/Left';
import Center from './components/Center/Center';
import Right from './components/Right/Right';
import Footer from './components/Footer/Footer';
import { countryNames } from './data/countries.js';

import { AppContext } from './Context';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: {
        country: '',
        filter: '',
        sort: ['cases', 'deaths', 'recovered'],
        sortIndex: 0,
        today: false,
        per100k: false,
        fetchCountry: this.fetchCountry.bind(this),
        fetchHistory: this.fetchHistory.bind(this),
        toggleApiState: this.toggleApiState.bind(this),
        chooseSort: this.chooseSort.bind(this),
        formatCounter: this.formatCounter.bind(this),
        countryName: this.countryName.bind(this),
        toggleFullScreen: this.toggleFullScreen,
        throttleTime: 100,
      }
    }
  }

  toggleFullScreen(event) {
    const parentComponent = ReactDOM.findDOMNode(event.target).parentNode;
    parentComponent.classList.toggle('fullscreen');
    const newState = {...this.state};
    newState.fullscreen = !newState.fullscreen;
    this.setState(newState);
  }

  fetchData(query, resultCallBack, errorCallBack) {
    const mainURL = 'https://disease.sh/v3/covid-19/';
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    const url = `${mainURL}${query}`;
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
      resultCallBack(result);
    })
    .catch(error => errorCallBack(error));
  }

  resultCallBack(result) {
    const newState = {...this.state};
    newState.isLoaded = true;
    newState.items = result;
    this.setState(newState);
  }

  errorCallBack(error) {
    const newState = {...this.state};
    newState.isLoaded = true;
    newState.error = error;
    this.setState(newState);
  }

  fetchCountry(child, url = '', countryFilter = true) {
    const sort = this.state.api.sort[this.state.api.sortIndex];
    const prefix = (url) ? `${url}` : '';
    const country = (this.state.api.country && countryFilter) ? `/${this.state.api.country}` : '';
    const postfix = (url || country) ? '?' : '';
    const query = `${prefix}${country}${postfix}sort=${sort}&allowNull=false`;
    this.fetchData(query, this.resultCallBack.bind(child), this.errorCallBack.bind(child));
  }

  fetchHistory(child, url = '', countryFilter = true) {
    const prefix = (url) ? url : '';
    const country = (this.state.api.country && countryFilter) ? `/${this.state.api.country}` : '/all';
    const query = `${prefix}${country}?lastdays=all`;
    this.fetchData(query, this.resultCallBack.bind(child), this.errorCallBack.bind(child));
  }

  toggleApiState(id, value) {
    if(!id) return false;
    const country = (id === 'country');
    const newState = {...this.state};
    newState.api[id] = (country) ? this.countryName(value) : value;
    this.setState(newState);
  }

  countryName(country) {
    for (const item of countryNames) {
      if (!item.possibleNames) item.possibleNames = [];
      if (country === item.name || item.possibleNames.includes(country)) return item.name;
    }
    return '';
  }

  chooseSort(sort = '') {
    const prefix = (this.state.api.today) ? 'today' : '';
    const sortType = sort || this.state.api.sort[this.state.api.sortIndex];
    const postfix = (this.state.api.today) ? sortType.slice(0, 1).toUpperCase().concat(sortType.slice(1)) : sortType;
    return `${prefix}${postfix}`;
  }

  formatCounter(counter = 0, population = 100000) {
    let count = (this.state.api.per100k) ? Math.round(counter / (population / 100000)) : counter;
    if (count === Infinity || isNaN(count)) count = 0;
    return count;
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div className="App">
          <Header />
          <Left api={this.state.api} />
          <Center api={this.state.api} />
          <Right api={this.state.api} />
          <Footer />
        </div>
      </AppContext.Provider>
    );
  }
}