// src/Home.js
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    // Fetch route information from the Flask API
    fetch("http://localhost:5000/all")
      .then((response) => response.json())
      .then((data) => setRouteInfo(data))
      .catch((error) => console.error("Error fetching route info:", error));
  }, []);

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the Home page.</p>

      <h3>Route Information</h3>
      {routeInfo ? (
        <pre>{JSON.stringify(routeInfo, null, 2)}</pre>
      ) : (
        <p>Loading route information...</p>
      )}
    </div>
  );
};

export default Home;
