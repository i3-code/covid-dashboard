// import './Left.scss';
import React from 'react';
import CountryFilter from './CountryFilter/CountryFilter';
import CountryList from './CountryList/CountryList';
import Nav from '../Nav/Nav';
import DateStamp from './DateStamp/DateStamp';

export default class Left extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    }
  }

  render() {
    return (
      <div className="Left component">
        <button className="expand" onClick={this.state.api.toggleFullScreen}></button>
        <CountryFilter api={this.props.api} />
        <CountryList api={this.props.api} />
        <Nav api={this.props.api} carousel={true} filters={false} />
        <DateStamp />
      </div>
    );
  }
}