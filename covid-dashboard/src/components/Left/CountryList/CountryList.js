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
      items: []
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
    setTimeout(() => this.throttle = false, 100);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    const sort = this.props.api.sort[this.props.api.sortIndex];
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul className="CountryList">
          {items.sort((a, b) => b[sort] - a[sort]).map(item => (
            <Country count={item[sort].toLocaleString()} name={item.country} flag={item.countryInfo.flag} key={item.country} />
          ))}
        </ul>
      );
    }
  }
}