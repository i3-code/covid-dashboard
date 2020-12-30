import './Map.scss';
import React from 'react';
import { MapContainer, MapConsumer, TileLayer, ZoomControl, GeoJSON, useMap } from 'react-leaflet';
import { useEffect } from "react";
import L from "leaflet";

import * as d3 from 'd3';

import worldData from '../../../data/countries.json';
import { countryNames } from '../../../data/countries.js';

import { MODES, THROTTLE_TIME } from '../../../constants';
import { countryName, toggleApiState, fetchCountry, chooseSort, formatCounter } from '../../../utils';

const casesColors = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];
const deathsColors = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];
const recoveredColors = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];

function Legend(props) {
  const map = useMap();
  const countryData = props.countryData;
  const max = Math.max(...Object.values(countryData));
  const colors = [casesColors, deathsColors, recoveredColors];
  const countryColors = colors[props.app.state.sortIndex];
  const steps = new Array(countryColors.length).fill().map((_, index) => Math.round(max / (index + 1)));

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const legendDiv = L.DomUtil.create('div', 'info legend');
      steps.reverse().forEach((item, index) => {
        const legendLine = L.DomUtil.create('div', 'legend_item', legendDiv);
        legendLine.innerHTML = `<i style="background: ${countryColors[index]}"></i><span>&lt; ${item}</span>`;
      });
      return legendDiv;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map, countryColors, steps]);
  return null;
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
    this.fetchCountry = fetchCountry.bind(props.app);
    this.chooseSort = chooseSort.bind(props.app);
    this.formatCounter = formatCounter.bind(props.app);
    this.toggleApiState = toggleApiState.bind(props.app);
    this.countryData = {};
  }

  generateRange() {
    if (!this.state.items.length) return false;
    const sort = this.chooseSort();
    const format = this.formatCounter;
    const data = [];
    this.state.items.forEach((item) => {
      let value = format(item[sort], item['population']);
      this.countryData[item.countryInfo.iso3] = value;
      data.push(value);
    })
    const colors = [casesColors, deathsColors, recoveredColors];
    this.countryColors = d3.scaleQuantile().domain(data).range(colors[this.props.app.state.sortIndex]);
  }

  styleGeoJson(id) {
    const countryValue = this.countryData[id] || 0;
    const fillColor = (countryValue) ? this.countryColors(countryValue) : '';
    const fillOpacity = (countryValue) ? 0.5 : 0;
    return {
      fillColor,
      weight: 0,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity,
    };
  }

  highlightFeature(e) {
    const layer = e.target;
    const { items } = this.state;
    const prefix = (this.props.app.state.today) ? 'Today' : 'Total';
    const postfix = (this.props.app.state.per100k) ? 'per100k' : '';
    const sort = MODES[this.props.app.state.sortIndex];
    const itemText = `${prefix} ${sort} ${postfix}`;

    layer.setStyle({ weight: 1, dashArray: 1, fillOpacity: 0.8 });
    for (const item of items) {
      if (item.countryInfo.iso3 === layer.feature.id) {
        const value = this.countryData[item.countryInfo.iso3].toLocaleString();
        layer.bindTooltip(
          `<div>
              <h5>${item.country}</h5>
              <p>${itemText}: ${value}</p>
           </div>`,
          {
            direction: 'bottom',
            sticky: true,
            className: 'leaflet-tooltip-own',
          }).openTooltip();
        break;
      }
    }
  }

  resetHighlight(e) {
    const id = e.target.feature.id;
    const layer = e.target;
    const style = this.styleGeoJson(id);
    layer.setStyle(style);
  }

  clickToFeature(e) {
    const country = countryName(e.target.feature.properties.name);
    const sameCountry = (this.props.app.state.country === country);
    const newCountry = (sameCountry) ? '' : country;
    this.toggleApiState('country', newCountry);
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

  moveMapToCountry() {
    const country = this.props.app.state.country;
    if (country) {
      for (const item of countryNames) {
        if (country === item.name || item.possibleNames.includes(country)) {
          this.map.setView([item.lat, item.long], this.map.getZoom());
          break;
        }
      }
    }
  }

  fetchData() {
    this.fetchCountry(this, 'countries', false);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    this.generateRange();
    this.moveMapToCountry();
    setTimeout(() => this.throttle = false, THROTTLE_TIME);
  }

  render() {
    const { error, isLoaded } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    if (!isLoaded) return <div>Loading...</div>;
    const position = [40, 2];
    const zoom = 2;
    const timestamp = Date.now();

    return (
      <MapContainer center={position} zoom={zoom} zoomControl={false}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          maxZoom={10}
          noWrap="true"
          bounds={[[-90, -180], [90, 180]]}
        />
        <ZoomControl position='topleft' />

        <GeoJSON
          key={timestamp}
          data={worldData.features}
          onEachFeature={this.onEachFeature.bind(this)}
        />

        <MapConsumer>
          {(map) => {
            this.map = map;
            this.map.invalidateSize();
            return null;
          }}
        </MapConsumer>
        <Legend app={this.props.app} countryData={this.countryData} />
      </MapContainer>
      );
  }
}

