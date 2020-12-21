import './Table.scss';
import React from 'react';
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
      showModal: false
    };
  }

  fetchData() {
    const page = (this.state.api.country) ? 'countries' : 'all';
    this.state.api.fetchCountry(this, page);
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
      const country = (this.state.api.country) ? this.state.api.country : 'Global';
        return (
              <div className="Table component">
                <button className="expand" onClick={this.state.api.toggleFullScreen}></button>
                <div className="Table_country_name">{country}:</div>
                <hr />
                <div>Cases: {cases}</div>
                <div>Deaths: {deaths}</div>
                <div>Recovered: {recovered}</div>
              </div>
            );
    }
  }
}