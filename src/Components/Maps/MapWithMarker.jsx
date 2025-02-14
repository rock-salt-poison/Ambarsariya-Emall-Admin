import React, { useEffect, useRef } from "react";
import { GoogleMap, MarkerF, Circle } from "@react-google-maps/api";
import { Typography } from "@mui/material";
import GoogleMapsLoader from "./GoogleMapsLoader"; // Ensure correct import

const MapWithMarker = ({ latitude, longitude, length }) => {
  const markerPosition = { lat: latitude, lng: longitude };
  const validLength = Number(length) * 1000 || 0; // Convert km to meters

  const circleRef = useRef(null); // Store reference to the Circle instance
  const mapRef = useRef(null); // Reference for the Google Map instance

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setMap(null); // Remove the previous circle from the map
      circleRef.current = null; // Clear reference
    }

    if (validLength > 0 && mapRef.current) {
      // Create a new circle instance
      circleRef.current = new window.google.maps.Circle({
        center: markerPosition,
        radius: validLength,
        fillColor: "rgba(255, 0, 0, 0.33)",
        strokeColor: "red",
        map: mapRef.current, // Attach to the existing map
      });
    }
  }, [validLength, latitude, longitude]); // Depend on length and location changes

  if (!latitude || !longitude) {
    return <Typography sx={{ width: "100%" }}>No location data available</Typography>;
  }

  return (
    <GoogleMapsLoader>
      <GoogleMap
        mapContainerStyle={{ height: "200px", width: "100%" }}
        zoom={15}
        center={markerPosition}
        onLoad={(map) => (mapRef.current = map)} // Store map reference
      >
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </GoogleMapsLoader>
  );
};

export default MapWithMarker;
