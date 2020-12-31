import './DateStamp.scss';
import React from 'react';

import { THROTTLE_TIME } from '../../../constants';
import { fetchAll } from '../../../utils';
export default class DateStamp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  fetchData() {
    fetchAll(this, 'all');
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
    
    const date = new Date(items.updated).toDateString();
    return (
      <div className="date_content">{date}</div>
    );
  }
}