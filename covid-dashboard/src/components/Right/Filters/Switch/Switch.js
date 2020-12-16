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
      return (
        <div className="can-toggle">
            <input id={this.props.name} type="checkbox" onChange={this.props.action}></input>
            <label htmlFor={this.props.name}>
                <div className="can-toggle__switch" data-checked={this.props.valueOn} data-unchecked={this.props.valueOff}></div>
            </label>
        </div>
      );
    }
  }