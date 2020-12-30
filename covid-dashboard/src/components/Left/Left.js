import React from 'react';
import CountryFilter from './CountryFilter/CountryFilter';
import CountryList from './CountryList/CountryList';
import Nav from '../Nav/Nav';
import DateStamp from './DateStamp/DateStamp';

import { toggleFullScreen, toggleApiState } from '../../utils';

export default class Left extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      filter: '',
    }
    this.toggleApiState = toggleApiState.bind(this);
    this.writeFilter = this.writeFilter.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  writeFilter(value= '') {
    const filter = (value.match(/[a-z.-\s]+/gi) || [""])[0];
    this.toggleApiState("filter", filter);
  }

  onChange(event) {
    this.writeFilter(event.target.value);
  }

  render() {
    return (
      <div className="Left component">
        <button className="expand" onClick={toggleFullScreen.bind(this)}></button>
        <CountryFilter onChange={this.onChange} writeFilter={this.writeFilter} />
        <CountryList filter={this.state.filter} app={this.props.app} />
        <Nav carousel={true} filters={this.state.fullscreen} app={this.props.app} />
        <DateStamp />
      </div>
    );
  }
}