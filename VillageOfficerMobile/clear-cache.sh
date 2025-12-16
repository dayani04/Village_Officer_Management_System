#!/bin/bash

echo "Clearing React Native Maps cache and Metro bundler..."

# Clear Metro bundler cache
npx expo start --clear

# Alternative commands if the above doesn't work:
echo "If the issue persists, try these commands:"
echo "1. npm start -- --reset-cache"
echo "2. expo r -c"
echo "3. Delete node_modules and reinstall: rm -rf node_modules && npm install"
echo "4. Reset project: npm run reset-project"
