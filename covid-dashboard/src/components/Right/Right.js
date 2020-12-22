// import './Right.scss';
import React from 'react';
import Table from './Table/Table';
import Nav from '../Nav/Nav';
import Graph from './Graph/Graph';

export default function Right(props) {
  return (
    <div className="Right component">
        <Table api={props.api} />
        <Nav api={props.api} carousel={false} filters={true} />
        <Graph api={props.api} />
    </div>
  )
}
