import './CountryList.css';
import React from 'react';
import Country from './Country/Country';
import Api from '../../../api/api';

export default class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  resultCallBack(result) {
    this.setState({
      isLoaded: true,
      items: result
    });
  }

  errorCallBack(error) {
    this.setState({
      isLoaded: true,
      error
    });
  }

  async componentDidMount() {
    const query = `countries?sort=${this.props.modeId}`
    new Api(query, this.resultCallBack.bind(this), this.errorCallBack.bind(this));
  }

  render() {
    const { error, isLoaded, items } = this.state;
    const { modeId }= this.props;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul className="CountryList">
          {items.sort((a, b) => b[modeId] - a[modeId]).map(item => (
            <Country count={item[modeId].toLocaleString()} name={item.country} flag={item.countryInfo.flag} key={item.country} />
          ))}
        </ul>
      );
    }
  }
}