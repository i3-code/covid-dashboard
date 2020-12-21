import './Center.scss';
import React from 'react';
import Map from './Map/Map';
import Nav from '../Nav/Nav';

export default function Center(props) {
  return (
    <main className="Center component">
      <button className="expand" onClick={props.api.toggleFullScreen}></button>
      <Map api={props.api} />
      <Nav api={props.api} carousel={true} filters={true} />
    </main>
  );
}