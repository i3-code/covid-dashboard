import './Filters.scss';
import React from 'react';
import Switch from './Switch/Switch';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    }
  }

  changeView(event) {
    const inputState = event.target.checked;
    this.state.api.toggleApiState('today', inputState);
  }

  changeTotal(event) {
    const inputState = event.target.checked;
    this.state.api.toggleApiState('per100k', inputState);
  }

  render() {
    const changeView = this.changeView.bind(this);
    const changeTotal = this.changeTotal.bind(this);

    return (
      <div className="Filters">
        <Switch name="ViewSwitch" valueOff="total" valueOn="today" action={changeView} api={this.props.api} />
        <Switch name="TotalSwitch" valueOff="total" valueOn="per100k" action={changeTotal} api={this.props.api} />
      </div>
    );
  }
}