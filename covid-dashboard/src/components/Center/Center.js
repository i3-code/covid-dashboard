import React from 'react';
import Map from './Map/Map';
import Nav from '../Nav/Nav';

import { toggleFullScreen } from '../../utils';

export default class Center extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
    }
  }

  render() {
    const needToRenderNavComponent = this.state.fullscreen;
    return (
      <main className="Center component">
        <button className="expand" onClick={toggleFullScreen.bind(this)}></button>
        <Map app={this.props.app} />
        <Nav app={this.props.app} carousel={needToRenderNavComponent} filters={needToRenderNavComponent} />
      </main>
    );
  }
}