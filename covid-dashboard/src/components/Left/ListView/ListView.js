import './ListView.css';
import React from 'react';

export default class ListView extends React.Component {

  render() {
    const changeMode = this.props.changeMode;
    const modeName = this.props.modeName;
    return (
      <div className="ListView">
        <button className="btn_arrow arrow_left" onClick={() => changeMode(-1)}></button>
        <span className="mode_name">{modeName}</span>
        <button className="btn_arrow arrow_right" onClick={() => changeMode(1)}></button>
      </div>
    );
  }
}