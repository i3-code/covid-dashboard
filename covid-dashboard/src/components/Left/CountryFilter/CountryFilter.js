import './CountryFilter.scss';
import React from 'react';

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

  render() {
    return (
        <input
          type="text"
          onKeyUp={this.onKeyUp.bind(this)}
          placeholder="Search.."
          title="Type in a country name"
          className="CountryFilter" />
    );
  }
}