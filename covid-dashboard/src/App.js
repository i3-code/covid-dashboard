import './App.scss';
import React from 'react';

import Header from './components/Header/Header';
import Left from './components/Left/Left';
import Center from './components/Center/Center';
import Right from './components/Right/Right';
import Footer from './components/Footer/Footer';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        country: '',
        sortIndex: 0,
        today: false,
        per100k: false,
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Left app={this} />
        <Center app={this} />
        <Right app={this} />
        <Footer />
      </div>
    );
  }
}