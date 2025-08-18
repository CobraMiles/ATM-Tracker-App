const { withDangerousMod } = require('@expo/config-plugins');

const withReactNativeMaps = (config) => {
  // Modify the app.json file for Google Maps API Key
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      config.modResults = config.modResults || {};
      if (config.modResults.infoPlist) {
        config.modResults.infoPlist.GMSApiKey = 'AIzaSyD6cFYXbOg5qbKq8kPbufu4Yv3cfe0lvr0'; // Replace with your API key
      }
      return config;
    },
  ]);

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      config.modResults = config.modResults || {};
      if (config.modResults.manifest) {
        config.modResults.manifest['com.google.android.geo.API_KEY'] = 'AIzaSyD6cFYXbOg5qbKq8kPbufu4Yv3cfe0lvr0'; // Replace with your API key
      }
      return config;
    },
  ]);

  return config;
};

module.exports = withReactNativeMaps;