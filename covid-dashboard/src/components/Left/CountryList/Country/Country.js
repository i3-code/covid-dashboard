import React from 'react';
import './Country.scss';

import { AppContext } from '../../../../Context';

export default class Country extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => {
          const countryClass = (this.props.name === context.api.country) ? 'country selected' : 'country';
          return (
             <li className={countryClass} onClick={() => {context.api.toggleApiState('country', this.props.name)}}>
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