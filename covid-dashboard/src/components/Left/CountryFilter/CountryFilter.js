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

  onChange(event) {
    const filter = (event.target.value.match(/[a-z.-\s]+/ig) || [''])[0];
    this.state.api.toggleApiState('filter', filter);
  }

  // componentDidMount() {
  //   const inject = document.getElementById('keyboard-input');
  //   new Keyboard(inject);
  // }

  render() {
    return (
        <input
          id="keyboard-input"
          type="text"
          onChange={this.onChange.bind(this)}
          placeholder="Search.."
          title="Type in a country name"
          className="CountryFilter" />
    );
  }
}