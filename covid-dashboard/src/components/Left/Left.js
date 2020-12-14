import React from 'react';
import CountryList from './CountryList/CountryList';
import ListView from './ListView/ListView';
import DateStamp from './DateStamp/DateStamp';

export default class Left extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modes: [
        ['cases', 'Total Confirmed'],
        ['deaths', 'Total Deaths'],
        ['recovered', 'Total Recovered'],
      ],
      mode: 0,
    }
  }

  changeMode(value) {
    const { mode, modes } = this.state;
    if (((mode + value) < 0) || ((mode + value) >= modes.length)) return;
    this.setState({
        mode: mode + value,
        modes: modes,
    });
  }

  render() {
    const changeMode = this.changeMode.bind(this)
    const [modeId, modeName] = this.state.modes[this.state.mode];
    return (
      <div className="Left">
        <CountryList modeId={modeId} />
        <ListView changeMode={changeMode} modeName={modeName} />
        <DateStamp />
      </div>
    );
  }
}