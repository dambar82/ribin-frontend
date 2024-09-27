import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from './marker-icon-2x.png'

const customIcon = new L.Icon({
    iconUrl: '/images/marker-icon-2x.png', // Вставьте сюда URL вашей иконки
    iconSize: [25, 41], // Размер иконки
    iconAnchor: [12, 41], // Анкер иконки
    popupAnchor: [1, -34], // Анкер всплывающего окна
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Тень метки
    shadowSize: [41, 41] // Размер тени
});

const Map = ({coordinates}) => {

useEffect(() => {
    console.log(coordinates)
}, [coordinates])

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
            {
                <Marker position={coordinates} icon={customIcon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            }
        </MapContainer>
    );
};

export default Map;
