import './Graph.scss';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush, AreaChart, Area, ResponsiveContainer } from 'recharts';
import Nav from '../../Nav/Nav';

import { MODES, THROTTLE_TIME } from '../../../constants';
import { fetchHistory, toggleFullScreen } from '../../../utils';
export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      fullscreen: false,
    };
    this.fetchHistory = fetchHistory.bind(props.app);
  }
  
  fetchData() {
    this.fetchHistory(this, 'historical', true);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, THROTTLE_TIME);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    if (!isLoaded) return <div>Loading...</div>;
    
    const nullItems = {
      cases: {"1/22/20": 0,},
      deaths: {"1/22/20": 0,},
      recovered: {"1/22/20": 0,}
    }
    const timeline = (items.country) ? items.timeline : (items.message) ? nullItems : items;
    const sort = MODES[this.props.app.state.sortIndex];
    const data = [];
      if (!timeline[sort]) { console.log(timeline)} else {
        for (const [key, value] of Object.entries(timeline[sort])) {
          const unit = {date: key};
          unit[sort] = value;
          data.push(unit);
        }  
      }

      const colors = { cases: '#a50f15', deaths: '#08519c', recovered: '#006d2c' }
      const color = colors[sort];
      const shortenNumber = (number) => {
        const shorter = Intl.NumberFormat('en', { notation: 'compact' });
        return shorter.format(number);
      }
      return (
        <div className="Graph component">
          <button className="expand" onClick={toggleFullScreen.bind(this)}></button>
          <div className="graph-container">
            <ResponsiveContainer>
              <LineChart data={data} >
                <XAxis dataKey='date' />
                <YAxis domain={['auto', 'auto']} tickFormatter={shortenNumber}/>
                <CartesianGrid stroke='#404040' vertical={false} />
                <Tooltip
                    wrapperStyle={{
                      borderColor: 'white',
                      boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
                    }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#404040' }}
                  />
                <Line
                  type="monotone"
                  strokeWidth={5}
                  yAxisId={0}
                  key="0"
                  dataKey={sort}
                  stroke={color}
                />
                  <Brush dataKey="date">
                  <AreaChart>
                    <CartesianGrid />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Area dataKey={sort} stroke={color} fill={color} dot={false}/>
                  </AreaChart>
                </Brush>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Nav app={this.props.app} carousel={this.state.fullscreen} filters={this.state.fullscreen} />
        </div>
      );
  }
}
