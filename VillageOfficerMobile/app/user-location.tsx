import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAuth } from '../src/context/AuthContext';
import { getProfile, updateVillagerLocation } from '../src/api/villager';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

interface Location {
  lat: number;
  lng: number;
}

// Google Maps WebView Component
const GoogleMapsView: React.FC<{ 
  latitude: number; 
  longitude: number; 
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ latitude, longitude, onLocationSelect }) => {
  const generateMapHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          #map { height: 100vh; width: 100%; }
          .controls {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .map-type-btn {
            margin: 2px;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            border-radius: 3px;
          }
          .map-type-btn.active {
            background: #4285f4;
            color: white;
          }
          .coords {
            margin-top: 10px;
            font-size: 12px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <button class="map-type-btn active" onclick="setMapType('satellite')">Satellite</button>
          <button class="map-type-btn" onclick="setMapType('hybrid')">Hybrid</button>
          <button class="map-type-btn" onclick="setMapType('roadmap')">Road</button>
          <button class="map-type-btn" onclick="setMapType('terrain')">Terrain</button>
          <div class="coords" id="coords">Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}</div>
        </div>
        <div id="map"></div>
        <script>
          let map;
          let marker;
          let currentMapType = 'satellite';
          
          function initMap() {
            const initialLocation = { lat: ${latitude}, lng: ${longitude} };
            
            map = new google.maps.Map(document.getElementById('map'), {
              center: initialLocation,
              zoom: 18,
              mapTypeId: 'satellite',
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false
            });
            
            marker = new google.maps.Marker({
              position: initialLocation,
              map: map,
              draggable: true,
              title: 'Selected Location'
            });
            
            google.maps.event.addListener(marker, 'dragend', function(event) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              updateCoords(lat, lng);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'location_update',
                latitude: lat,
                longitude: lng
              }));
            });
            
            google.maps.event.addListener(map, 'click', function(event) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              marker.setPosition({ lat, lng });
              updateCoords(lat, lng);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'location_update',
                latitude: lat,
                longitude: lng
              }));
            });
          }
          
          function setMapType(type) {
            currentMapType = type;
            map.setMapTypeId(type);
            
            // Update button styles
            document.querySelectorAll('.map-type-btn').forEach(btn => {
              btn.classList.remove('active');
            });
            event.target.classList.add('active');
          }
          
          function updateCoords(lat, lng) {
            document.getElementById('coords').textContent = 
              'Lat: ' + lat.toFixed(6) + ', Lng: ' + lng.toFixed(6);
          }
          
          // Load Google Maps API
          const script = document.createElement('script');
          script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        </script>
      </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location_update') {
        onLocationSelect(data.latitude, data.longitude);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <WebView
      source={{ html: generateMapHtml() }}
      style={{ flex: 1 }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.mapLoading}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.mapLoadingText}>Loading Google Maps...</Text>
        </View>
      )}
    />
  );
};

const UserLocationScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('satellite');

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    // Fallback GPS functionality - will be enhanced with expo-location later
    setGettingLocation(true);
    setError('');
    
    // Simulate getting location (Colombo, Sri Lanka as default)
    setTimeout(() => {
      const defaultLocation = { lat: 6.9271, lng: 79.8612 };
      setLatitude(defaultLocation.lat.toFixed(8));
      setLongitude(defaultLocation.lng.toFixed(8));
      setGettingLocation(false);
      
      Alert.alert(
        'Location Found', 
        `Current location: ${defaultLocation.lat.toFixed(6)}, ${defaultLocation.lng.toFixed(6)}\n\nNote: This is a simulated location. GPS functionality will be available after app restart.`
      );
    }, 2000);
  };

  const fetchCurrentLocation = async () => {
    try {
      const profileData = await getProfile();
      if (profileData.Latitude && profileData.Longitude) {
        const location = {
          lat: parseFloat(profileData.Latitude),
          lng: parseFloat(profileData.Longitude)
        };
        setCurrentLocation(location);
        setLatitude(profileData.Latitude.toString());
        setLongitude(profileData.Longitude.toString());
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch location');
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleMapPress = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(8));
    setLongitude(lng.toFixed(8));
    openGoogleMaps(lat, lng);
  };

  const openGoogleMaps = async (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    Alert.alert(
      'Open Google Maps',
      `Would you like to open Google Maps to view this location?\n\nCoordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Maps', 
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              
              if (supported) {
                await Linking.openURL(url);
                console.log('Opened Google Maps with URL:', url);
              } else {
                Alert.alert('Error', 'Google Maps is not available on this device');
              }
            } catch (error) {
              console.error('Error opening Google Maps:', error);
              Alert.alert('Error', 'Unable to open Google Maps');
            }
          }
        }
      ]
    );
  };

  const handleUpdateLocation = async () => {
    console.log('handleUpdateLocation called with state:', { latitude, longitude });
    
    if (!latitude || !longitude) {
      console.error('Missing latitude or longitude:', { latitude, longitude });
      setError('Latitude and Longitude are required');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    console.log('Parsed coordinates:', { lat, lng });
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error('Invalid coordinates:', { lat, lng });
      setError('Invalid Latitude or Longitude values');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      
      // Get villager ID from profile
      const profileData = await getProfile();
      console.log('Updating location for villager:', profileData.Villager_ID, 'with coords:', lat, lng);
      
      await updateVillagerLocation(profileData.Villager_ID, lat, lng);
      
      Alert.alert(
        'Location Updated',
        `Your location has been updated to: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (err: any) {
      console.error('Update location error:', err);
      setError(err.error || 'Failed to update location');
      setUpdating(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading location...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Location</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Current Location Display */}
      <View style={styles.content}>
        <View style={styles.currentLocationCard}>
          <Text style={styles.cardTitle}>Current Location</Text>
          {currentLocation ? (
            <View style={styles.locationDisplay}>
              <Text style={styles.locationText}>
                Latitude: {currentLocation.lat.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {currentLocation.lng.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noLocationText}>No location set yet</Text>
          )}
        </View>

        {/* Map View */}
        <View style={styles.mapCard}>
          <Text style={styles.cardTitle}>Map View</Text>
          {latitude && longitude ? (
            <View style={styles.mapContainer}>
              <GoogleMapsView
                latitude={parseFloat(latitude)}
                longitude={parseFloat(longitude)}
                onLocationSelect={(lat, lng) => {
                  setLatitude(lat.toFixed(8));
                  setLongitude(lng.toFixed(8));
                  openGoogleMaps(lat, lng);
                }}
              />
              <View style={styles.mapOverlay}>
                <TouchableOpacity 
                  style={styles.openMapsButton}
                  onPress={() => openGoogleMaps(parseFloat(latitude), parseFloat(longitude))}
                >
                  <Text style={styles.openMapsButtonText}>Open in Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Set coordinates to see map</Text>
              <Text style={styles.mapSubText}>Enter coordinates manually or get current location</Text>
              <TouchableOpacity 
                style={styles.mapButton} 
                onPress={handleGetCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.mapButtonText}>Get Current Location</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Manual Location Input */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Manual Location Entry</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Latitude</Text>
            <TextInput
              style={styles.textInput}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="e.g., 6.9271"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Longitude</Text>
            <TextInput
              style={styles.textInput}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="e.g., 79.8612"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.coordinatesDisplay}>
            <Text style={styles.coordinatesText}>
              Selected: {latitude || 'Not set'}, {longitude || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleBack}
            disabled={updating}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={handleUpdateLocation}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.updateButtonText}>Update Location</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Location Information</Text>
          <Text style={styles.infoText}>• Sri Lanka coordinates range:</Text>
          <Text style={styles.infoText}>  Latitude: 5.9° to 9.8° N</Text>
          <Text style={styles.infoText}>  Longitude: 79.5° to 81.9° E</Text>
          <Text style={styles.infoText}>• Tap on map to select location</Text>
          <Text style={styles.infoText}>• Or enter coordinates manually</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
    marginLeft: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#721c24',
    fontSize: Typography.sm,
  },
  content: {
    padding: Spacing.lg,
  },
  currentLocationCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  locationDisplay: {
    backgroundColor: '#f8f9fa',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  locationText: {
    fontSize: Typography.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  noLocationText: {
    fontSize: Typography.sm,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e3f2fd',
    borderRadius: Spacing.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  mapSubText: {
    fontSize: Typography.sm,
    color: '#6c757d',
    marginBottom: Spacing.md,
  },
  mapButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  mapButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    borderRadius: Spacing.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  mapLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  mapLoadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  openMapsButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    alignItems: 'center',
  },
  openMapsButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  mapTypeToggle: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.xs,
    flexDirection: 'row',
  },
  mapTypeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.xs,
    backgroundColor: 'transparent',
  },
  mapTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  mapTypeButtonText: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: '#333',
  },
  mapTypeButtonTextActive: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    backgroundColor: 'white',
  },
  coordinatesDisplay: {
    backgroundColor: '#e3f2fd',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginTop: Spacing.sm,
  },
  coordinatesText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    flex: 1,
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    flex: 1,
    marginLeft: Spacing.sm,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff3cd',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sm,
    color: '#856404',
    marginBottom: Spacing.xs,
  },
});

export default UserLocationScreen;
