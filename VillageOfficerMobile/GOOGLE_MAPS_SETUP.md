# Google Maps Setup for Village Officer Mobile App

## Overview
The Village Officer Mobile App includes a Houses feature that displays villager locations on an interactive map using Google Maps.

## Prerequisites
1. Google Maps API Key
2. React Native Maps (already installed)
3. Expo configuration (already set up)

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (for search functionality)
4. Create credentials:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Restrict the API key to your app for security

## Step 2: Configure API Keys

Update your `app.json` file with your actual API keys:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "react-native-maps",
        {
          "iosGoogleMapsApiKey": "YOUR_ACTUAL_IOS_GOOGLE_MAPS_API_KEY",
          "androidGoogleMapsApiKey": "YOUR_ACTUAL_ANDROID_GOOGLE_MAPS_API_KEY"
        }
      ]
    ]
  }
}
```

Replace:
- `YOUR_ACTUAL_IOS_GOOGLE_MAPS_API_KEY` with your iOS API key
- `YOUR_ACTUAL_ANDROID_GOOGLE_MAPS_API_KEY` with your Android API key

## Step 3: Android Configuration (if needed)

For Android, you may also need to add your API key to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ANDROID_API_KEY"/>
  ...
</application>
```

## Step 4: iOS Configuration (if needed)

For iOS, add your API key to `ios/AppDelegate.mm`:

```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_IOS_API_KEY"];
  ...
}
```

## Step 5: Restart Your App

After configuring the API keys, restart your Expo development server:

```bash
expo start --clear
```

## Features Available

### Houses Page Features:
- **Interactive Map**: View all villagers with location data on a Google Map
- **Search Functionality**: Search villagers by name or address
- **Location Grouping**: Multiple villagers at the same location are grouped
- **Marker Details**: Tap markers to see villager information
- **Real-time Filtering**: Search results update the map view automatically
- **Location-based Navigation**: Map automatically centers on search results

### Navigation:
- From the Village Officer Dashboard, tap the "Houses" button
- Use the back button to return to the dashboard

## Troubleshooting

### Common Issues:

1. **Map not loading**:
   - Check if API keys are correctly configured
   - Ensure the Maps SDK is enabled in Google Cloud Console
   - Verify internet connectivity

2. **API Key errors**:
   - Make sure the API key is not restricted to the wrong package name
   - Check if the API key has the correct APIs enabled

3. **Build issues**:
   - Clear Expo cache: `expo start --clear`
   - Reset the project if needed: `npm run reset-project`

### Testing:
- Test on both Android and iOS devices if possible
- Verify that markers appear for villagers with valid coordinates
- Test search functionality with different villager names and addresses

## Data Requirements

The Houses feature requires villagers to have valid `Latitude` and `Longitude` values in the database. Villagers without valid coordinates will be filtered out automatically.

## Security Notes

- Keep your API keys secure and don't commit them to version control
- Use environment variables for API keys in production
- Restrict your API keys to only the APIs your app needs
- Consider implementing API key rotation for production apps
