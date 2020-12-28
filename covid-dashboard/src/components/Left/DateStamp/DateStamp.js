import './DateStamp.scss';
import React from 'react';
export default class DateStamp extends React.Component {
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
    this.state.api.fetchAll(this, 'all');
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
      const date = new Date(items.updated).toDateString();
      return (
        <div className="date_content">{date}</div>
      );
    }
  }
}