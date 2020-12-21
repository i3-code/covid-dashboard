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
    // console.log(this.props.sortIndex)
    return (
      <label className="can_toggle">
        <input id={this.props.name} type="checkbox" onChange={this.props.action}/>
        {/* data-checked={this.props.valueOn} data-unchecked={this.props.valueOff} */}
          <div className="can_toggle__switch round" data-sort={this.props.sortIndex && this.props.sortIndex}>
            <span className="value_off">{this.props.valueOff}</span>
            <span className="value_on">{this.props.valueOn}</span>
          </div>
      </label>
    );
  }
}