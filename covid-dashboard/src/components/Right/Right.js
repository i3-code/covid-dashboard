import React from 'react';
import Table from './Table/Table';
import Nav from '../Nav/Nav';
import Graph from './Graph/Graph';

export default function Right(props) {
  return (
    <div className="Right component">
        <Table app={props.app} />
        <Nav app={props.app} carousel={false} filters={true} />
        <Graph app={props.app} />
    </div>
  )
}
