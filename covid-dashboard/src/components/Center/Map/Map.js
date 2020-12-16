import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MapContainer, MapConsumer, TileLayer, ZoomControl, Circle, Popup, GeoJSON, Tooltip, LayerGroup } from 'react-leaflet';
import './Map.css';
import WorldData from 'geojson-world-map';
import { tooltip } from 'leaflet';
// import { AppContext } from '../../../Context';
// const liSelected = document.querySelector('.selected');

const dafaultGeoJSONStyle = {
  color: 'white',
  weight: 0,
  fillColor: '',
  fillOpacity: 0,
}

const highlightGeoJSONStyle = {
  color: 'gray',
  weight: 0.2,
  dashArray: '',
  fillOpacity: 0.7
}

// const customToolTip = ({ layer }) => {
//   let popupContent;
//   if (layer.properties) {
//     popupContent = layer.feature.properties.name;
//   }

//   return (
//     <div>
//       {popupContent}
//     </div>
//   );
// };

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
      activeCircle: null,
    };
  }

  highlightFeature(e) {
    const layer = e.target;
    layer.setStyle(highlightGeoJSONStyle);
    // return (
    //   <Tooltip>{layer.feature.properties.name}</Tooltip>
    // )
    // console.log(layer.feature.properties.name);
  }

  resetHighlight(e) {
    const layer = e.target;
    layer.setStyle(dafaultGeoJSONStyle);
  }

  clickToFeature(e) {
    this.map.flyTo(e.latlng, this.map.getZoom())
  }

  onEachFeature(feature, layer) {
    let popup = <Popup />;
    layer.bindPopup(popup);
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
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    const { modeId } = this.props;
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
              data={WorldData}
              onEachFeature={this.onEachFeature.bind(this)}
              style={dafaultGeoJSONStyle}
            >
              {/* <Tooltip></Tooltip> */}
              
            </GeoJSON>
            
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
               <Tooltip> <div>{item.country}</div> <div>Cases: {item.cases}</div> </Tooltip>
               </Circle>
          ))}

          {this.state.activeCircle && (<Popup position={[this.state.activeCircle.countryInfo.lat, this.state.activeCircle.countryInfo.long]} onClose={() => {
            console.log(this.state.activeCircle);
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
                <p>Today cases: {this.state.activeCircle.todayCases}</p>
                <p>Today deaths: {this.state.activeCircle.todayDeaths}</p>
                <p>Today recovered: {this.state.activeCircle.todayRecovered}</p>
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