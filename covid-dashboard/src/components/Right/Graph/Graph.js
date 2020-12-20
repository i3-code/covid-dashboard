import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush, AreaChart, Area } from 'recharts';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
    };
  }
  
  fetchData() {
    this.state.api.fetchHistory(this, 'historical', true);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const timeline = (items.country) ? items.timeline : items;
      const sort = this.state.api.sort[this.state.api.sortIndex];
      const data = [];
      for (const [key, value] of Object.entries(timeline[sort])) {
        const unit = {date: key};
        unit[sort] = value;
        data.push(unit);
      }

      const colors = { cases: '#a50f15', deaths: '#08519c', recovered: '#006d2c' }
      const color = colors[sort];
      return (
        <div className='line-chart-wrapper'>
          <LineChart
            width={600}
            height={300}
            data={data}
          >
          <XAxis dataKey='date' />
          <YAxis domain={['auto', 'auto']} />
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
              <Area dataKey={sort} stroke={color} fill={color} dot={false} />
            </AreaChart>
          </Brush>
        </LineChart>
      </div>
      )
    }

  }
}
