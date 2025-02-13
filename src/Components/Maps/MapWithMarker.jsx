import React from "react";
import { GoogleMap, MarkerF, Circle } from "@react-google-maps/api";
import { Typography } from "@mui/material";
import GoogleMapsLoader from "./GoogleMapsLoader"; // Ensure correct import

const MapWithMarker = ({ latitude, longitude, length }) => {
  if (latitude === null || longitude === null || latitude === undefined || longitude === undefined) {
    return <Typography sx={{ width: "100%" }}>No location data available</Typography>;
  }

  const markerPosition = { lat: latitude, lng: longitude };
  const validLength = Number(length) * 1000 || 0; // Convert km to meters

  return (
    <GoogleMapsLoader>
      <GoogleMap
        mapContainerStyle={{ height: "200px", width: "100%" }}
        zoom={25}
        center={markerPosition}
        zoomControl={true} // Enabled for better UX
      >
        <MarkerF position={markerPosition} />
        {validLength > 0 && (
          <Circle
            center={markerPosition}
            radius={validLength} // Now in meters
            options={{ fillColor: "rgba(255, 0, 0, 0.33)", strokeColor: "red" }}
          />
        )}
      </GoogleMap>
    </GoogleMapsLoader>
  );
};

export default MapWithMarker;
