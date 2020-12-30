import React from 'react';
import './Country.scss';

import { toggleApiState } from '../../../../utils';
export default class Country extends React.Component {
  constructor(props) {
    super(props);
    this.toggleApiState = toggleApiState.bind(props.app);
  }

  render() {
    const sameCountry = (this.props.app.state.country === this.props.name);
    const countryClass = (sameCountry) ? 'country selected' : 'country';
    return (
             <li className={countryClass} onClick={() => {
              const newCountry = (sameCountry) ? '' : this.props.name;
              this.toggleApiState('country', newCountry);
              }}>
             <span className="countryFlag"><img src={this.props.flag} alt=""/></span>
             <span className="countryCounter" data-sort={this.props.app.state.sortIndex}>{this.props.count}</span>
             <span className="countryName">{this.props.name}</span>
           </li>);
  }
}