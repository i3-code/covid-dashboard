import './Table.css';
import React from 'react';

import { AppContext } from '../../../Context';
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: []
    };
  }

  fetchData() {
    const page = (this.state.api.country) ? 'countries' : 'all';
    this.state.api.fetch(this, page);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, 100);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    const { cases, deaths, recovered } = items;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <AppContext.Consumer>
          {context => {
            const country = (context.api.country) ? context.api.country : 'Global';
            return (
              <div className="Table">
                <div>{country}:</div>
                <div>Cases: {cases}</div>
                <div>Deaths: {deaths}</div>
                <div>Recovered: {recovered}</div>
              </div>
            )
          }}
        </AppContext.Consumer>
      );
    }
  }
}