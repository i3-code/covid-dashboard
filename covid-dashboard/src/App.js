import './App.css';
import React from 'react';

import Api from './api/api';
import Header from './components/Header/Header';
import Left from './components/Left/Left';
import Center from './components/Center/Center';
import Right from './components/Right/Right';
import Bottom from './components/Bottom/Bottom';


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
        throttleTime: 100,
      }
    }
  }

  chooseSort(sort = '') {
    const prefix = (this.state.api.today) ? 'today' : '';
    const sortType = sort || this.state.api.sort[this.state.api.sortIndex];
    const postfix = (this.state.api.today) ? sortType.slice(0, 1).toUpperCase().concat(sortType.slice(1)) : sortType;
    return `${prefix}${postfix}`;
  }

  formatCounter(counter, population = 100000) {
    const count = (this.state.api.per100k) ? Math.round(counter / (population / 100000)) : counter;
    return count.toLocaleString();
  }

  toggleApiState(id, value) {
    if(!id) return false;
    const newState = {...this.state};
    newState.api[id] = value;
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