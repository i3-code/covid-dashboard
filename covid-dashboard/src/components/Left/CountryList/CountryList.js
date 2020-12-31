import './CountryList.scss';
import React from 'react';
import Country from './Country/Country';
import { fetchCountry, chooseSort, formatCounter } from '../../../utils';
import { THROTTLE_TIME } from '../../../constants';

export default class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
    this.fetchCountry = fetchCountry.bind(props.app);
    this.chooseSort = chooseSort.bind(props.app);
    this.formatCounter = formatCounter.bind(props.app);
  }

  fetchData() {
    this.fetchCountry(this, 'countries', false);
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

    const sort = this.chooseSort();
    const format = this.formatCounter;
    const regExp = new RegExp(this.props.filter, 'ig');
    return (
      <ul className="CountryList">
      {items.filter((a) => a.country.search(regExp) >= 0)
        .sort((a, b) => format(b[sort], b.population) - format(a[sort], a.population))
        .map(item => {
        const possibleNames = item.possibleNames || [];
        const count = format(item[sort], item.population).toLocaleString();
        return (
          <Country app={this.props.app} count={count} name={item.country} possibleNames={possibleNames} flag={item.countryInfo.flag} key={item.country} coords={[item.countryInfo.lat, item.countryInfo.long]} />
        )})}
      </ul>
    );
  }
}