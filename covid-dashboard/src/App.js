import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Left from './components/Left/Left';
import Center from './components/Center/Center';
import Right from './components/Right/Right';

import { CountryStateContext } from './Context';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: {
        name: 'default',
        toggleCountry: this.toggleCountry.bind(this),
      }
    }
  }
  
  toggleCountry(value) {
    this.setState({
      country: {
        name: value,
        toggleCountry: this.toggleCountry.bind(this),
      }
    });
  }

  render() {
    return (
      <CountryStateContext.Provider value={this.state.country}>
        <div className="App">
        <Header />
        <Left />
        <Center />
        <Right />
        </div>
      </CountryStateContext.Provider>
    );
    }
}