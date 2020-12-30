import React from 'react';
import Carousel from './Carousel/Carousel';
import Filters from './Filters/Filters';

import { MODES } from '../../constants';
import { toggleApiState } from '../../utils';
export default class Nav extends React.Component {
  changeMode(value) {
    const sortIndex = this.props.app.state.sortIndex;
    let newValue = sortIndex + value;
    if (newValue >= MODES.length) newValue = 0;
    if (newValue < 0 ) newValue = MODES.length - 1;
    toggleApiState.call(this.props.app, 'sortIndex', newValue);
  }

  generateModeName() {
    const {today, per100k} = this.props.app.state;
    const prefix = (today) ? 'Today' : 'Total';
    const postfix = (per100k) ? 'per100k' : '';
    const stateName = MODES[this.props.app.state.sortIndex];
    const shortName = stateName.slice(0, 1).toUpperCase().concat(stateName.slice(1));
    return `${prefix} ${shortName} ${postfix}`;
  }

  render() {
    const changeMode = this.changeMode.bind(this)
    const modeName = this.generateModeName();

    const carousel = () => { if (this.props.carousel) return <Carousel changeMode={changeMode} modeName={modeName} /> };
    const filters = () => { if (this.props.filters) return <Filters app={this.props.app} /> };

    return (
        <div className="Nav component">
            { carousel() }
            { filters() }
        </div>
    );
  }
}