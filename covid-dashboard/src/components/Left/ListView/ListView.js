import './ListView.css';
import React from 'react';

export default class ListView extends React.Component {
    render() {
        const changeMode = this.props.changeMode;
        const modeName = this.props.modeName;
        return (
            <div className="ListView">
              <span className="Arrow">
                <button onClick={() => changeMode(-1)}>Left</button>
              </span>
              <span>{modeName}</span>
              <span>
              <button onClick={() => changeMode(1)}>Right</button>
              </span>
            </div>
            );
    }
}