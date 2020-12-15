import React from 'react';
import { MapContainer, MapConsumer, TileLayer, Circle, Popup, GeoJSON } from 'react-leaflet';
import './Map.css';
import WorldData from 'geojson-world-map';

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
  }
  
  resetHighlight(e) {
    const layer = e.target;
    layer.setStyle(dafaultGeoJSONStyle);
  }
  
  clickToFeature(e) {
    this.map.setView(e.latlng, this.map.getZoom())
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
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, 100);
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
        <MapContainer center={position} zoom={zoom} >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            noWrap="true"
            bounds={[[-90, -180], [90, 180]]}
          />

          <GeoJSON
            data={WorldData}
            onEachFeature={this.onEachFeature.bind(this)}
            style={dafaultGeoJSONStyle}
            // eventHandlers={{
            //   click: (e) => {
            //     console.log('click');
            //     console.log(e.target.getBounds());
            //   },
            // }}
          />

          {items.sort((a, b) => b[modeId] - a[modeId]).map(item => (
            <Circle
              key={item.country}
              center={[item.countryInfo.lat, item.countryInfo.long]}
              radius={200 * Math.sqrt(item.cases)}
              stroke={false}
              pathOptions={{ fillColor: '#990000', fillOpacity: 0.9 }}
              eventHandlers={{
                click: () => {
                  this.setState({
                    activeCircle: item,
                  });
                },
              }}
            />
          ))}

          {/* <Popup>
                <span><b>Country: {item.country}</b><br /><b>Cases: {item.cases}</b><br /><b>Deaths: {item.deaths}</b><br /><b>Today cases: {item.todayCases}</b><br /><b>Today Deaths: {item.todayDeaths}</b></span>
              </Popup> */}

          {/* </Circle> */}

          {this.state.activeCircle && (<Popup position={[this.state.activeCircle.countryInfo.lat, this.state.activeCircle.countryInfo.long]} onClose={() => {
            this.setState({
              activeCircle: null,
            });
          }}>
            <div className='info_pannel'>
              <div className="info_pannel_country">{this.state.activeCircle.country}</div>
              <hr/>
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
        </MapContainer>
      );

    }
  }
}
