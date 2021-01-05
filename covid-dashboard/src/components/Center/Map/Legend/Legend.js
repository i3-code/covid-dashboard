import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from "leaflet";

import { COLORS } from '../../../../constants';

export default function Legend(props) {
    const map = useMap();
    const max = Math.max(...Object.values(props.countryData));
    const countryColors = COLORS[props.app.state.sortIndex];
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
  