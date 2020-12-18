import './App.css';
import React from 'react';

import Api from './api/api';
import Header from './components/Header/Header';
import Left from './components/Left/Left';
import Center from './components/Center/Center';
import Right from './components/Right/Right';
import Bottom from './components/Bottom/Bottom';

import { countryNames } from './data/countries.js';

import { AppContext } from './Context';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: {
        country: '',
        sort: ['cases', 'deaths', 'recovered'],
        sortIndex: 0,
        today: false,
        per100k: false,
        fetch: this.fetchApi.bind(this),
        toggleApiState: this.toggleApiState.bind(this),
        chooseSort: this.chooseSort.bind(this),
        formatCounter: this.formatCounter.bind(this),
        countryName: this.countryName.bind(this),
        throttleTime: 100,
      }
    }
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

  formatCounter(counter = 0, population = 100000, locale = true) {
    const count = (this.state.api.per100k) ? Math.round(counter / (population / 100000)) : counter;
    return (locale) ? count.toLocaleString() : count;
  }

  toggleApiState(id, value) {
    if(!id) return false;
    const country = (id === 'country');
    const newState = {...this.state};
    newState.api[id] = (country) ? this.countryName(value) : value;
    this.setState(newState);
  }

  async fetchApi(child, url = '', countryFilter = true) {
    const sort = this.state.api.sort[this.state.api.sortIndex];
    const prefix = (url) ? `${url}` : '';
    const country = (this.state.api.country && countryFilter) ? `/${this.state.api.country}` : '';
    const postfix = (url || country) ? '?' : '';
    const query = `${prefix}${country}${postfix}sort=${sort}`;
    
    const resultCallBack = (result) => {
      const newState = {...child.state};
      newState.isLoaded = true;
      newState.items = result;
      child.setState(newState);
    };

    const errorCallBack = (error) => {
      const newState = {...child.state};
      newState.isLoaded = true;
      newState.error = error;
      child.setState(newState);
    };

    new Api(query, resultCallBack.bind(this), errorCallBack.bind(this));
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div className="App">
          <Header />
          <Left api={this.state.api} />
          <Center api={this.state.api} />
          <Right api={this.state.api} />
          <Bottom api={this.state.api} />
        </div>
      </AppContext.Provider>
    );
    }
}