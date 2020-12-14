import React from 'react';
import './Country.scss';

import { CountryStateContext } from '../../../../Context';

export default class Country extends React.Component {
  render() {
    return (
      <CountryStateContext.Consumer>
        {context => {
          const countryClass = (this.props.name === context.name) ? 'country selected' : 'country';
          return (
             <li className={countryClass} onClick={() => {context.toggleCountry(this.props.name)}}>
             <span className="countryCounter">{this.props.count}</span>
             <span className="countryName">{this.props.name}</span>
             <span className="countryFlag">
               <img src={this.props.flag} alt=""/>
             </span>
           </li>
      )}}
    </CountryStateContext.Consumer>
    );
  }
}