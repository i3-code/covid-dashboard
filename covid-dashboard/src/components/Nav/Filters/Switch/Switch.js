import './Switch.scss';
import React from 'react';

export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    }
  }

  render() {
    const checked = this.state.api[this.props.valueOn];
    return (
      <label className="can_toggle">
        <input id={this.props.name} type="checkbox" onChange={this.props.action} checked={checked} />
          <div className="can_toggle__switch round" data-sort={this.state.api.sortIndex}>
            <span className="value_off">{this.props.valueOff}</span>
            <span className="value_on">{this.props.valueOn}</span>
          </div>
      </label>
    );
  }
}