import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import * as villagerApi from '../../../../../api/villager';
import './VillagerLocationSearch.css';

// Google Maps settings
const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 6.9271, // Default to Colombo, Sri Lanka
  lng: 79.8612
};

const libraries = ['places'];

const Houses = () => {
  const [villagers, setVillagers] = useState([]);
  const [filteredVillagers, setFilteredVillagers] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
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

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchVillagers = async () => {
      try {
        const villagerData = await villagerApi.fetchVillagers();
        // Filter villagers with valid coordinates
        const validVillagers = villagerData.filter(
          villager => villager.Latitude && villager.Longitude &&
          !isNaN(parseFloat(villager.Latitude)) && !isNaN(parseFloat(villager.Longitude))
        );
        setVillagers(validVillagers);
        setFilteredVillagers(validVillagers); // Initially show all villagers
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch villagers');
        setLoading(false);
      }
    };

    fetchVillagers();
  }, []);

  const handleSearchChange = (e) => {
    const address = e.target.value;
    setSearchAddress(address);

    if (address.trim() === '') {
      setFilteredVillagers(villagers);
      setSelectedLocation(null);
      setMapCenter(defaultCenter);
      if (map) {
        map.panTo(defaultCenter);
        map.setZoom(10);
      }
    } else {
      const filtered = villagers.filter(villager =>
        villager.Address?.toLowerCase().includes(address.toLowerCase())
      );
      setFilteredVillagers(filtered);
      setSelectedLocation(null); // Reset selected location on new search
      // If there's at least one match, center on the first match's coordinates
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
    navigate('/village-officer/dashboard');
  };

  // Group villagers by unique location (Latitude, Longitude)
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
    return <div className="houses-container">Loading...</div>;
  }

  if (error) {
    return <div className="houses-container">Error: {error}</div>;
  }

  return (
    <div className="houses-container">
      <h2>Villager Locations</h2>
      <div className="search-bar">
        <label htmlFor="address-search">Search by Address: </label>
        <input
          type="text"
          id="address-search"
          value={searchAddress}
          onChange={handleSearchChange}
          placeholder="Enter address (e.g., Colombo)"
        />
      </div>
      <div className="map-and-details">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={searchAddress && filteredVillagers.length > 0 ? 15 : 10}
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
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Standard red marker for clarity
                    scaledSize: new window.google.maps.Size(32, 32) // Adjust size for visibility
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
                  <h3>Villagers at {selectedLocation.villagers[0].Address || 'this Location'}</h3>
                  {selectedLocation.villagers.map((villager, index) => (
                    <div key={villager.Villager_ID} className="villager-info">
                      <h4>{villager.Full_Name}</h4>
                      <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
                      <p><strong>Email:</strong> {villager.Email}</p>
                      <p><strong>Phone:</strong> {villager.Phone_No}</p>
                      <p><strong>Coordinates:</strong> Lat: {villager.Latitude}, Lng: {villager.Longitude}</p>
                      <p><strong>Election Participate:</strong> {villager.IsParticipant === 1 ? 'Yes' : 'No'}</p>
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
        {searchAddress && filteredVillagers.length > 0 && (
          <div className="villager-details-panel">
            <h3>Villagers Matching "{searchAddress}"</h3>
            {filteredVillagers.map((villager) => (
              <div key={villager.Villager_ID} className="villager-detail">
                <h4>{villager.Full_Name}</h4>
                <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
                <p><strong>Email:</strong> {villager.Email}</p>
                <p><strong>Phone:</strong> {villager.Phone_No}</p>
                <p><strong>Coordinates:</strong> Lat: {villager.Latitude}, Lng: {villager.Longitude}</p>
                <p><strong>Election Participate:</strong> {villager.IsParticipant === 1 ? 'Yes' : 'No'}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="houses-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Houses;