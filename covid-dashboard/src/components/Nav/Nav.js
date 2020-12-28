import React from 'react';
import Carousel from './Carousel/Carousel';
import Filters from './Filters/Filters';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    }
  }

  changeMode(value) {
    const { sort, sortIndex } = this.state.api;
    if (((sortIndex + value) < 0) || ((sortIndex + value) >= sort.length)) return;
    this.state.api.toggleApiState('sortIndex', sortIndex + value);
  }

  generateModeName() {
    const {today, per100k} = this.state.api;
    const prefix = (today) ? 'Today' : 'Total';
    const postfix = (per100k) ? 'per100k' : '';
    const stateName = this.state.api.sort[this.state.api.sortIndex];
    const shortName = stateName.slice(0, 1).toUpperCase().concat(stateName.slice(1));
    return `${prefix} ${shortName} ${postfix}`;
  }

  render() {
    const changeMode = this.changeMode.bind(this)
    const modeName = this.generateModeName();

    const carousel = () => { if (this.props.carousel) return <Carousel changeMode={changeMode} modeName={modeName} /> };
    const filters = () => { if (this.props.filters) return <Filters api={this.props.api} /> };

    return (
        <div className="Nav component">
            { carousel() }
            { filters() }
        </div>
    );
  }
}