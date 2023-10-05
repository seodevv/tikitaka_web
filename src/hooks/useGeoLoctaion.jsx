import { useEffect, useState } from "react";

const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState();
  const [error, setError] = useState("");

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};

export default useGeoLocation;
