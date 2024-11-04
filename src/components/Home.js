// src/Home.js
import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext'; // Import DataContext

const Home = () => {
  const { data: routeInfo, loading, error } = useContext(DataContext); // Access data, loading, and error from context

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the Home page.</p>

      <h3>Route Information</h3>
      {loading && <p>Loading route information...</p>}
      {error && <p>Error fetching route information: {error}</p>}
      {routeInfo && (
        <pre>{JSON.stringify(routeInfo, null, 2)}</pre>
      )}
    </div>
  );
};

export default Home;
