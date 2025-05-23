import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import * as villagerApi from '../../../../../api/villager';
import './Houses.css';

// Google Maps settings
const defaultCenter = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612
};

const libraries = ['places'];

const Houses = () => {
  const [villagers, setVillagers] = useState([]);
  const [filteredVillagers, setFilteredVillagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapHeight, setMapHeight] = useState('600px'); // Default height
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);

  const navigate = useNavigate();

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const containerStyle = {
    width: '100%', // Fixed width
    height: mapHeight // Dynamic height
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchVillagers = async () => {
      try {
        const villagerData = await villagerApi.fetchVillagers();
        const validVillagers = villagerData.filter(
          villager => villager.Latitude && villager.Longitude &&
          !isNaN(parseFloat(villager.Latitude)) && !isNaN(parseFloat(villager.Longitude))
        );
        setVillagers(validVillagers);
        setFilteredVillagers(validVillagers);
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch villager data. Please try again.');
        setLoading(false);
      }
    };

    fetchVillagers();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredVillagers(villagers);
      setSelectedLocation(null);
      setMapCenter(defaultCenter);
      if (map) {
        map.panTo(defaultCenter);
        map.setZoom(10);
      }
    } else {
      const filtered = villagers.filter(villager =>
        (villager.Full_Name?.toLowerCase().includes(query.toLowerCase()) ||
         villager.Address?.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredVillagers(filtered);
      setSelectedLocation(null);
      if (filtered.length > 0) {
        const lat = parseFloat(filtered[0].Latitude);
        const lng = parseFloat(filtered[0].Longitude);
        setMapCenter({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    }
  };

  const handleHeightChange = (e) => {
    setMapHeight(e.target.value);
  };

  const handleMarkerClick = (locationKey, villagersAtLocation) => {
    const [lat, lng] = locationKey.split(',').map(coord => parseFloat(coord));
    setSelectedLocation({ lat, lng, villagers: villagersAtLocation });
    setMapCenter({ lat, lng });
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(15);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const groupVillagersByLocation = () => {
    const locationMap = {};
    filteredVillagers.forEach(villager => {
      const key = `${villager.Latitude},${villager.Longitude}`;
      if (!locationMap[key]) {
        locationMap[key] = [];
      }
      locationMap[key].push(villager);
    });
    return locationMap;
  };

  const locationMap = groupVillagersByLocation();

  if (loading) {
    return <div className="location-search-container">Loading...</div>;
  }

  if (error) {
    return <div className="location-search-container">Error: {error}</div>;
  }

  return (
    <div className="location-search-container">
      <h2>Villager Location Search</h2>
      <div className="search-bar">
        <label htmlFor="search-query">Search by Name or Address:</label>
        <input
          type="text"
          id="search-query"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Enter name or address (e.g., John Doe or Colombo)"
        />
      </div>
      <div className="map-and-details">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={searchQuery && filteredVillagers.length > 0 ? 15 : 10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {Object.entries(locationMap).map(([key, villagersAtLocation]) => {
              const [lat, lng] = key.split(',').map(coord => parseFloat(coord));
              return (
                <Marker
                  key={key}
                  position={{ lat, lng }}
                  onClick={() => handleMarkerClick(key, villagersAtLocation)}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32)
                  }}
                />
              );
            })}
            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="info-window">
                  <h3>Villagers at this Location</h3>
                  {selectedLocation.villagers.map((villager, index) => (
                    <div key={villager.Villager_ID} className="villager-info">
                      <h4>{villager.Full_Name}</h4>
                      <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
                      <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
                      <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
                      {index < selectedLocation.villagers.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Loading Map...</div>
        )}
        {searchQuery && (
          <div className="villager-details-panel">
            <h3>Search Results for "{searchQuery}"</h3>
            {filteredVillagers.length > 0 ? (
              filteredVillagers.map((villager) => (
                <div key={villager.Villager_ID} className="villager-detail">
                  <h4>{villager.Full_Name}</h4>
                  <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
                  <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
                  <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No villagers found matching "{searchQuery}".</p>
            )}
          </div>
        )}
      </div>
      <div className="location-search-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Houses;