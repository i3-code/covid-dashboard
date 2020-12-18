import React from 'react';
import { MapContainer, MapConsumer, TileLayer, ZoomControl, Circle, Popup, GeoJSON } from 'react-leaflet';
import './Map.css';

import worldData from '../../../data/countries.json';
import { countryNames } from '../../../data/countries.js';

// import WorldData from 'geojson-world-map';
// import { AppContext } from '../../../Context';

// const dafaultGeoJSONStyle = {
//   color: 'white',
//   weight: 0,
//   fillColor: '',
//   fillOpacity: 0,
// }

const highlightGeoJSONStyle = {
  color: 'white',
  weight: 1,
  dashArray: '1',
  fillOpacity: 0.7
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
      activeCircle: null,
      mode: 'cases',
    };

    // this.mode = document.querySelector('.ListView').dataset;
    // console.log(props);
    this.geoJsonLayer = React.createRef();
  }

  getColor(mode, d) {
    if (mode === 'cases') {
      return d > 1000000  ? '#e60000' :
      d > 100000  ? '#ff1a1a' :
      d > 10000  ? '#ff4d4d' :
      d > 1000   ? '#ff6666' :
      d > 100   ? '#ff9999' :
      d > 10   ? '#ffcccc' :
                 '#ffe6e6';
    }

    if (mode === 'deaths') {
      return d > 10000000  ? '#1a1a1a' :
      d > 1000000  ? '#333333' :
      d > 100000  ? '#4d4d4d' :
      d > 10000   ? '#666666' :
      d > 1000   ? '#808080' :
      d > 100   ? '#999999' :
                 '#bfbfbf';
    }

    if (mode === 'recovered') {
      return d > 10000000  ? '#2d862d' :
      d > 1000000  ? '#39ac39' :
      d > 100000  ? '#53c653' :
      d > 10000   ? '#79d279' :
      d > 1000   ? '#8cd98c' :
      d > 100   ? '#b3e6b3' :
                 '#c6ecc6';
    }

  }

  styleGeoJson(curMode, feature) {
    // console.log(feature);
    const { items } = this.state;
    // const sortIndex = this.state.api.sortIndex;
    // const sort = this.state.api.sort;

    for (const item of items) {
      if (item.countryInfo.iso3 === feature.id) {

        return {
            fillColor: this.getColor(curMode, item[curMode]),
            weight: 0,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.8
        };
      }
    }
}


  highlightFeature(e) {
    const layer = e.target;
    // console.log(layer.feature);
    layer.setStyle(highlightGeoJSONStyle);
    const { items } = this.state;
    for (const item of items) {
      if (item.countryInfo.iso3 === layer.feature.id) {
        layer.bindTooltip(`<div class=""><h5>${item.country}</h5> <p>Cases: ${item.cases}</p></div>`, 
        {
          direction: 'bottom',
          sticky: true,
          className: 'leaflet-tooltip-own',
        }).openTooltip();
        break;
      }
    }
    // layer.feature.properties.name
  }

  resetHighlight(e) {
    const layer = e.target;
    // console.log(this.geoJsonLayer.current);
    this.geoJsonLayer.current.resetStyle(layer);
  }

  moveMapToCountry() {
    const country = this.state.api.country;
    if (country) {
      for (const item of countryNames) {
        if (country === item.name) {
          // this.map.flyTo([item.lat, item.long], 5)
          this.map.panTo([item.lat, item.long]);
          break;
        }
      }
    }
  }


  clickToFeature(e) {
    const country = this.state.api.countryName(e.target.feature.properties.name);
    const sameCountry = (this.state.api.country === country);
    const newCountry = (sameCountry) ? '' : country;
    this.state.api.toggleApiState('country', newCountry);
    // if (!sameCountry) this.map.flyTo(e.latlng, this.map.getZoom());
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.clickToFeature.bind(this),
    });
  }

  fetchData() {
    this.state.api.fetch(this, 'countries', false);
    
  }

  componentDidMount() {
    this.fetchData();

    this.setState({
      mode: document.querySelector('.ListView').dataset.mode,
    });
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
    this.moveMapToCountry();

    // console.log(this.state.mode);
    // this.setState({
    //   mode: document.querySelector('.ListView').dataset.mode,
    // });
    if (this.state.mode) {
      this.styleGeoJson(this.geoJsonLayer, this.state.mode);
    }

  }

  render() {
    const { error, isLoaded, items, mode} = this.state;
    const { modeId } = this.props;
    // console.log(modeId);

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const position = [30, 0];
      const zoom = 2;

      return (
        <MapContainer center={position} zoom={zoom} zoomControl={false}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            noWrap="true"
            bounds={[[-90, -180], [90, 180]]}
          />
          <ZoomControl position='bottomleft' />

          <GeoJSON
            data={worldData.features}
            onEachFeature={this.onEachFeature.bind(this)}
            // style={dafaultGeoJSONStyle}
            style={this.styleGeoJson.bind(this, mode)}
            ref={this.geoJsonLayer}
          />

          {items.sort((a, b) => b[modeId] - a[modeId]).map(item => (
            <Circle
              key={item.country}
              center={[item.countryInfo.lat, item.countryInfo.long]}
              radius={200 * Math.sqrt(item.cases)}
              stroke={false}
              pathOptions={{ fillColor: '#990000', fillOpacity: 0.9 }}
              eventHandlers={{
                click: (e) => {
                  this.setState({
                    activeCircle: item,
                  });
                  this.map.flyTo(e.latlng);
                },
              }}
             
            >
               {/* <Tooltip> <div>{item.country}</div> <div>Cases: {item.cases}</div> </Tooltip> */}
               </Circle>
          ))}

          {this.state.activeCircle && (<Popup position={[this.state.activeCircle.countryInfo.lat, this.state.activeCircle.countryInfo.long]} onClose={() => {
            // console.log(this.state.activeCircle);
            this.setState({
              activeCircle: null,
            });
          }}>
            <div className='info_pannel'>
              <div className="info_pannel_country">{this.state.activeCircle.country}</div>
              <hr />
              <div className="info_pannel_content">
                <p>Total cases: {this.state.activeCircle.cases}</p>
                <p>Total deaths: {this.state.activeCircle.deaths}</p>
                <p>Total recovered: {this.state.activeCircle.recovered}</p>
                {/* <p>Today cases: {this.state.activeCircle.todayCases}</p>
                <p>Today deaths: {this.state.activeCircle.todayDeaths}</p>
                <p>Today recovered: {this.state.activeCircle.todayRecovered}</p> */}
              </div>
            </div>
          </Popup>
          )}
          <MapConsumer>
            {(map) => {
              this.map = map;
              return null;
            }}
          </MapConsumer>
          {/* <AppContext.Consumer>
            {value => console.log(value)}
          </AppContext.Consumer> */}

        </MapContainer>

      );

    }
  }
}