import './CountryList.css';
import React from 'react';
import Country from './Country/Country';

export default class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  fetchData() {
    this.state.api.fetch(this, 'countries', false);
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
    const sort = this.state.api.chooseSort();
    const format = this.state.api.formatCounter;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul className="CountryList">
          {items.sort((a, b) => format(b[sort], b.population) - format(a[sort], a.population)).map(item => {
            const possibleNames = item.possibleNames || [];
            const count = format(item[sort], item.population);
            return (
            <Country count={count} name={item.country} possibleNames={possibleNames} flag={item.countryInfo.flag} key={item.country} coords={[item.countryInfo.lat, item.countryInfo.long]} />
          )})}
        </ul>
      );
    }
  }
}