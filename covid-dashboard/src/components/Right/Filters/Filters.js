import './Filters.css';
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
           <Switch name="ViewSwitch" valueOff="Total" valueOn="Today" action={changeView} />
           <Switch name="TotalSwitch" valueOff="Total" valueOn="Per100K" action={changeTotal} />
        </div>
      );
    }
  }