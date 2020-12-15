import React from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import Api from '../../../api/api'

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
      }
    
      resultCallBack(result) {
        this.setState({
          isLoaded: true,
          items: result
        });
      }
    
      errorCallBack(error) {
        this.setState({
          isLoaded: true,
          error
        });
      }
    
      async componentDidMount() {
        const query = `countries?sort=${this.props.modeId}`
        new Api(query, this.resultCallBack.bind(this), this.errorCallBack.bind(this));
      }
    
      render() {
        const { error, isLoaded, items } = this.state;
        const { modeId }= this.props;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
            const position = [35, -40];
            const zoom = 2;
            return (
                <MapContainer center={position} zoom={zoom}>
                    <TileLayer
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    {items.sort((a, b) => b[modeId] - a[modeId]).map(item => (
                        <Circle
                            key={item.country}
                            center={[item.countryInfo.lat, item.countryInfo.long]}
                            radius={200 * Math.sqrt(item.cases)}
                            fillColor='red'
                      />
                    ))}
                </MapContainer>
            /*
            <ul className="CountryList">

            </ul>
            */
          );
        }
      }
}
