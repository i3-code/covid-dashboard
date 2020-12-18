import './ListView.css';
import React from 'react';

export default class ListView extends React.Component {
  
    render() {
        const changeMode = this.props.changeMode;
        const modeName = this.props.modeName;
        return (
            <div className="ListView" data-mode={(modeName.split(' ')[1]).toLowerCase()}>
              <span className="Arrow">
                <button onClick={() => changeMode(-1)}>&lt;</button>
              </span>
              <span>{modeName}</span>
              <span>
              <button onClick={() => changeMode(1)}>&gt;</button>
              </span>
            </div>
            );
    }
}

// data-mode={(modeName.split(' ')[1]).toLowerCase()}