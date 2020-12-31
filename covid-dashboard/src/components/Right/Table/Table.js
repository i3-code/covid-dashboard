import './Table.scss';
import React from 'react';
import Nav from '../../Nav/Nav';

import { THROTTLE_TIME } from '../../../constants';
import { fetchCountry, formatCounter, toggleFullScreen } from '../../../utils';
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      fullscreen: false,
    };
    this.fetchCountry = fetchCountry.bind(props.app);
    this.formatCounter = formatCounter.bind(props.app);
  }

  fetchData() {
    const page = (this.props.app.state.country) ? 'countries' : 'all';
    this.fetchCountry(this, page);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, THROTTLE_TIME);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    if (!isLoaded) return <div>Loading...</div>;
    
    const today = this.props.app.state.today;
    const population = items.population;
    let cases = (today) ? items.todayCases : items.cases;
    cases = this.formatCounter(cases, population).toLocaleString();
    let deaths = (today) ? items.todayDeaths : items.deaths;
    deaths = this.formatCounter(deaths, population).toLocaleString();
    let recovered = (today) ? items.todayRecovered : items.recovered;
    recovered = this.formatCounter(recovered, population).toLocaleString();
    const country = (this.props.app.state.country) ? this.props.app.state.country : 'Global';
    return (
      <div className="Table component">
        <button className="expand" onClick={toggleFullScreen.bind(this)}></button>
        <div className="Table_country_name">{country}:</div>
        <hr />
        <div>Cases: {cases}</div>
        <div>Deaths: {deaths}</div>
        <div>Recovered: {recovered}</div>
        <Nav app={this.props.app} carousel={this.state.fullscreen} filters={this.state.fullscreen} />
      </div>
    );
  }
}