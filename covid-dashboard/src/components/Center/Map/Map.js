import React from 'react';
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, MapConsumer, TileLayer, ZoomControl, GeoJSON, useMap } from 'react-leaflet';
import './Map.css';
// import Control from "react-leaflet-control";
import * as d3 from 'd3';

import worldData from '../../../data/countries.json';
import { countryNames } from '../../../data/countries.js';


const highlightGeoJSONStyle = {
  color: 'white',
  weight: 1,
  dashArray: '1',
  fillOpacity: 0.75
}

const Legend = (api) => {
  // console.log(api);
  const map = useMap()

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // const colors = [d3.schemeReds[5], d3.schemeGreys[5], d3.schemeGreens[5]]
      const colors = d3.schemeReds[5];
      console.log(colors);
      // const color = d3.scaleOrdinal(colors[api.sortIndex]);

      const grades = [0, 1000000, 2500000, 5000000, 10000000]
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        console.log(colors[i]);

        labels.push(
          '<div class="legend_item"> <i style="background:' + 
          //  + вот сюда как-то добавить изменение цвета???
          colors[i] + '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+") + '</div>'
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };
    
    legend.addTo(map);
    
    // почему-то исходно добавляет две легенды, поэтому нужна эта штука
    return () => legend.remove();
  });

  return null;
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
    this.layerColors = {};
  }


  updateMapStyles() {
    if (!this.state.items.length) return;
    const colors = [d3.schemeReds[5], d3.schemeGreys[5], d3.schemeGreens[5]]
    const color = d3.scaleOrdinal(colors[this.state.api.sortIndex]);
    const sort = this.state.api.chooseSort();
    const format = this.state.api.formatCounter;
    const maxNumber = format(this.state.items[0][sort], this.state.items[0]['population'], false);

    this.state.items.reverse().forEach((item, index) => {
      const id = item.countryInfo.iso3;
      const value = format(item[sort], item.population, false);
      this.layerColors[id] = color(value);
    });

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

  // addLegend() {
  //   console.log(this.map && this.map.leafletElement);

  //   const legend = L.control({ position: "bottomright" });
  //   console.log(legend);

  //   legend.onAdd = () => {
  //     const div = L.DomUtil.create('div', 'info legend');
  //     const grades = [0, 100, 1000, 10000, 100000, 1000000];
  //     let labels = [];
  //     let from;
  //     let to;

  //     for (let i = 0; i < grades.length; i++) {
  //       from = grades[i];
  //       to = grades[i + 1];

  //       labels.push(
  //         '<i style="background: red"' +
  //         // getColor(from + 1) +
  //         '"></i> ' +
  //         from +
  //         (to ? "&ndash;" + to : "+")
  //       );
  //     }

  //     div.innerHTML = labels.join("<br>");

  //     return div;
  //   };

  //   // legend.addTo.bind(this.map.getBounds());
  //   // this.map.addControl(legend);
  //   // console.log('wow');

  //   if (this.map) {
  //     legend.addTo(this.map);
  //   }

  // }

  getCountryColor(id) {
    if (!this.state.items.length) return '';
    for (const item of this.state.items) {
      if (item.countryInfo.iso3 === id) {
        return this.layerColors[id];
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
    // this.api.state.sort[this.api.state.sortIndex];
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
    const country = this.state.api.countryName(e.target.feature.properties.name)
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
    this.updateMapStyles();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    this.moveMapToCountry();
    this.updateMapStyles();
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
        // ref={this.map}
        <MapContainer center={position} zoom={zoom} zoomControl={false}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            noWrap="true"
            bounds={[[-90, -180], [90, 180]]}
          />
          <ZoomControl position='topright' />

          <GeoJSON
            data={worldData.features}
            onEachFeature={this.onEachFeature.bind(this)}
            key={timestamp}
          />
          
          <Legend api={this.state.api} />
            
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

