import React from 'react';
import CountryList from './CountryList/CountryList';
import ListView from './ListView/ListView';
import DateStamp from './DateStamp/DateStamp';

export default class Left extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    }
  }

  changeMode(value) {
    const { sort, sortIndex } = this.state.api;
    if (((sortIndex + value) < 0) || ((sortIndex + value) >= sort.length)) return;
    const newState = {...this.state};
    newState.api.sortIndex = sortIndex + value;
    this.setState(newState);
  }

  generateModeName() {
    const {today, per100k} = this.state.api;
    const prefix = (today) ? 'Today' : 'Total';
    const postfix = (per100k) ? 'per100k' : '';
    const stateName = this.state.api.sort[this.state.api.sortIndex];
    const shortName = stateName.slice(0, 1).toUpperCase().concat(stateName.slice(1));
    return `${prefix} ${shortName} ${postfix}`;
  }

  render() {
    const changeMode = this.changeMode.bind(this)
    const modeName = this.generateModeName();
    return (
      <div className="Left">
        <CountryList api={this.props.api} />
        <ListView changeMode={changeMode} modeName={modeName} />
        <DateStamp />
      </div>
    );
  }
}