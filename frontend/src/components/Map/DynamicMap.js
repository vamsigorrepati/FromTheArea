import { useEffect } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './leaflet-beautify-marker-icon.js'

import styles from './Map.module.scss';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
  let mapClassName = styles.map;

  if ( className ) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    if (typeof L !== 'undefined' && L.BeautifyIcon) {
      const iconOptions = {
        isAlphaNumericIcon: false,
        icon: "circle",
        text: "", 
        iconShape: 'marker',
        borderColor: 'black',
        backgroundColor: '#f7575f',
        textColor: '#68C952',
        innerIconStyle: 'color: #000000;' // CSS styles
      };
  
     // Override the default icon for all markers
      Leaflet.Marker.prototype.options.icon = L.BeautifyIcon.icon(iconOptions);
    }
  }, []);

  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  )
}

export default Map;
