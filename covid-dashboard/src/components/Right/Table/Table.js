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
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const population = items.population;
      let cases = (this.state.api.today) ? items.todayCases : items.cases;
      cases = this.state.api.formatCounter(cases, population).toLocaleString();
      let deaths = (this.state.api.today) ? items.todayDeaths : items.deaths;
      deaths = this.state.api.formatCounter(deaths, population).toLocaleString();
      let recovered = (this.state.api.today) ? items.todayRecovered : items.recovered;
      recovered = this.state.api.formatCounter(recovered, population).toLocaleString();
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