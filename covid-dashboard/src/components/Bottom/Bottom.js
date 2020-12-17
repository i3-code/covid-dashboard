import React from 'react';
// import Chart from "chart.js";
import './Bottom.css';
import { Line, Bar } from 'react-chartjs-2';

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: []
    };
  }

  // lineChart() {
  //   const { items } = this.state;
  //   (
  //     <LineZ
  //       data={{
  //         labels: items.map(item => item.country),
  //         datasets: [
  //           {
  //             data: items.map(item => item.cases),
  //             label: 'Total cases',
  //             borderColor: '#3333ff',
  //             fill: false,
  //           }
  //         ]
  //       }}
  //     />
  //   )
  // }

  fetchData() {
    this.state.api.fetch(this, 'countries', false);
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
    // console.log(items)
    const { modeId } = this.props;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className='graph_container'>
          {/* <canvas id='myChart' ref={this.chartRef} width="400px" height="400px"> */}
          <Line
            data={{
              labels: items.sort((b, a) => b[modeId] - a[modeId]).map(item => item.country),
              datasets: [
                {
                  data: items.sort((b, a) => b[modeId] - a[modeId]).map(item => item.cases),
                  label: 'Total cases',
                  borderColor: 'gray',
                  fill: false,
                }
              ]
            }}
            options={{
              maintainAspectRatio: false,
              layout: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      // stepSize: 10000000
                    }
                  }],
                  xAxes: [{
                    gridLines: {
                      display: false
                    },
                  }]
                }
              }
            }}
          />
          {/* <Bar
            data={{
              labels: ['Total Cases'],
              datasets: [
                {
                  label: items[0].country,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    // "rgba(0, 255, 0, 0.5)"
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                  ],
                  data: [
                    items[0].cases
                    // console.log(items[0].cases)
                    // items.map(item => item.cases)
                  ]
                },
              ]
            }}
            options={{
            //   scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero: true
            //         }
            //     }]
            // }

              // legend: {display: true}
            }}
          /> */}
          {/* </canvas> */}
        </div>
      )
    }

  }
}


export default function Bottom(props) {
  return (
    <div className="Bottom">
      <LineGraph api={props.api} />
    </div>
  );
}
