import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map = ({coordinates}) => {
    return (
        <MapContainer
            //@ts-ignore
            center={coordinates}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                //@ts-ignore
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //@ts-ignore
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates}>
               <Popup>
                   A pretty CSS3 popup. <br /> Easily customizable.
               </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
