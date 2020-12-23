// import './Center.scss';
import React from 'react';
import Map from './Map/Map';
import Nav from '../Nav/Nav';

export default class Center extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      fullscreen: false,
    }
  }

  render() {
    return (
      <main className="Center component">
        <button className="expand" onClick={this.props.api.toggleFullScreen.bind(this)}></button>
        <Map api={this.props.api} />
        <Nav api={this.props.api} carousel={this.state.fullscreen} filters={this.state.fullscreen} />
      </main>
    );
  }
}