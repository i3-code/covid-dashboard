import React from 'react';
import './Country.scss';

import { AppContext } from '../../../../Context';

export default class Country extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => {
          const sameCountry = (context.api.country === this.props.name);
          const countryClass = (sameCountry) ? 'country selected' : 'country';
          return (
             <li className={countryClass} onClick={() => {
              const newCountry = (sameCountry) ? '' : this.props.name;
              context.api.toggleApiState('country', newCountry);
              }}>
             <span className="countryCounter">{this.props.count}</span>
             <span className="countryName">{this.props.name}</span>
             <span className="countryFlag">
               <img src={this.props.flag} alt=""/>
             </span>
           </li>
      )}}
    </AppContext.Consumer>
    );
  }
}