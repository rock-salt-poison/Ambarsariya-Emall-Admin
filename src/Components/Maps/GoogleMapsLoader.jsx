import React from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const API_KEY = process.env.REACT_APP_GOOGLE_API;

const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY, // Replace with your actual API key
    libraries,
  });

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return children;
};

export default GoogleMapsLoader;

