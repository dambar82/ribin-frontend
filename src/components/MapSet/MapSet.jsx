import React, {useEffect, useState} from 'react';
import {Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: '/images/marker-icon-2x.png', // Вставьте сюда URL вашей иконки
    iconSize: [25, 41], // Размер иконки
    iconAnchor: [12, 41], // Анкер иконки
    popupAnchor: [1, -34], // Анкер всплывающего окна
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Тень метки
    shadowSize: [41, 41] // Размер тени
});

const MapSet = ({coordinates, coordsSet}) => {
    const [markerPosition, setMarkerPosition] = useState(coordinates);
    const map = useMapEvents({
        click: async (e) => {
           const { lat, lng } = e.latlng;
           console.log(lat, lng)
            setMarkerPosition([lat, lng]);
           coordsSet([lat, lng])
        }
    })

    return (
        <>
            <TileLayer
                //@ts-ignore
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //@ts-ignore
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {
                markerPosition && (
                    <Marker position={markerPosition} icon={customIcon}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                )
            }
        </>
    );
};

export default MapSet;