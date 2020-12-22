import './CountryFilter.scss';
// import './kb-style.css';

import React from 'react';
// import Keyboard from './keyboard';
export default class CountryFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    };
  }

  onKeyUp(event) {
    const filter = (event.target.value.match(/[a-z.-\s]+/ig) || [''])[0];
    this.state.api.toggleApiState('filter', filter);
  }

  /*
  componentDidMount() {
    const keyboard = new Keyboard();
    const body = document.getElementById('keyboard-input');
    body.addEventListener('focus', keyboard.inputEngine.bind(keyboard));
  }
  */

  render() {
    return (
        <input
          id="keyboard-input"
          type="text"
          onKeyUp={this.onKeyUp.bind(this)}
          placeholder="Search.."
          title="Type in a country name"
          className="CountryFilter" />
    );
  }
}