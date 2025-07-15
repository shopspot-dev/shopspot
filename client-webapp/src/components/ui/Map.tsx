import React from 'react';
import Map, { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface MapViewProps {
  location: Location;
  zoom?: number;
}

export default function MapView({ location, zoom = 13 }: MapViewProps) {
  return (
    <Map
      initialViewState={{
        longitude: location.lng,
        latitude: location.lat,
        zoom: zoom
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken="YOUR_MAPBOX_TOKEN"
    >
      <Marker
        longitude={location.lng}
        latitude={location.lat}
        anchor="bottom"
      >
        <MapPin className="h-6 w-6 text-green-600" />
      </Marker>
    </Map>
  );
}