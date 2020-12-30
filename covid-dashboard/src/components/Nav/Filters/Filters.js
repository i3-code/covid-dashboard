import './Filters.scss';
import React from 'react';
import Switch from './Switch/Switch';

import { toggleApiState } from '../../../utils';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.toggleApiState = toggleApiState.bind(props.app)
  }

  changeView(event) {
    const inputState = event.target.checked;
    this.toggleApiState('today', inputState);
  }

  changeTotal(event) {
    const inputState = event.target.checked;
    this.toggleApiState('per100k', inputState);
  }

  render() {
    const changeView = this.changeView.bind(this);
    const changeTotal = this.changeTotal.bind(this);

    return (
      <div className="Filters">
        <Switch name="ViewSwitch" valueOff="total" valueOn="today" action={changeView} app={this.props.app} />
        <Switch name="TotalSwitch" valueOff="total" valueOn="per100k" action={changeTotal} app={this.props.app} />
      </div>
    );
  }
}