import './Table.css';
import React from 'react';

import { CountryStateContext } from '../../../Context';

export default class Table extends React.Component {
  render() {
    return (
          <CountryStateContext.Consumer>
            {context => (
               <div className="Country">{context.name}</div>
            )}
          </CountryStateContext.Consumer>
    );
  }
}