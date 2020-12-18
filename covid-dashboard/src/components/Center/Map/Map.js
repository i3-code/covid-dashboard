import React from 'react';
import { MapContainer, MapConsumer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import './Map.css';

import * as d3 from 'd3';

import worldData from '../../../data/countries.json';
import { countryNames } from '../../../data/countries.js';


const highlightGeoJSONStyle = {
  color: 'white',
  weight: 1,
  dashArray: '1',
  fillOpacity: 0.75
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
    };
  }


  /*
  getCountryColor(id) {
    if (!this.state.items.length) return '';
    const colorGradations = 9;
    const colors = [d3.schemeReds[colorGradations], d3.schemeGreys[colorGradations], d3.schemeGreens[colorGradations]];
    const color = d3.scaleOrdinal(colors[this.state.api.sortIndex]);

    const sort = this.state.api.sort[this.state.api.sortIndex];
    const format = this.state.api.formatCounter;
    const maxNumber = format(this.state.items[0][sort], this.state.items[0]['population'], false);

    console.log(this.state.items[0]);
    for (const item of this.state.items.reverse()) {
      if (item.countryInfo.iso3 === id) {
          const value = format(item[sort], item.population, false);
          const percent = parseFloat((value / maxNumber).toFixed(2));
          return color(percent);
      }
    }
    return '';
  }
  */

 getCountryColor(id) {
  if (!this.state.items.length) return '';
  const colors = ['red', 'black', 'green'];
  const color = colors[this.state.api.sortIndex];

  for (const item of this.state.items.reverse()) {
    if (item.countryInfo.iso3 === id) {
        return color;
    }
  }
  return '';
}

  styleGeoJson(id) {
    const fillColor = this.getCountryColor(id);
    const fillOpacity = (fillColor) ? 0.75 : 0;
    const style = {
      fillColor,
      weight: 0,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity,
    };
    return style;
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
    const id = e.target.feature.id;
    const layer = e.target;
    const style = this.styleGeoJson(id);
    layer.setStyle(style);
  }

  moveMapToCountry() {
    const country = this.state.api.country;
    if (country) {
      for (const item of countryNames) {
        if (country === item.name) {
          this.map.flyTo([item.lat, item.long], this.map.getZoom())
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
  }

  onEachFeature(feature, layer) {
    const style = this.styleGeoJson(feature.id);
    layer.setStyle(style);
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
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    this.moveMapToCountry();
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
  }

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const position = [30, 0];
      const zoom = 2;
      const timestamp = Date.now();

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
            key={timestamp}
          />

          <MapConsumer>
            {(map) => {
              this.map = map;
              return null;
            }}
          </MapConsumer>
        </MapContainer>
      );
    }
  }
}