import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [atms, setAtms] = useState([]);
  const BASE_URL = "http://10.211.200.4/atm-tracker-web/atm-api/api";

  // Dummy ATM data
  
  // const atms = [
  //   { id: 1, name: "ATM 1", lat: 3.848, lng: 11.502 },
  //   { id: 2, name: "ATM 2", lat: 3.850, lng: 11.504 },
  //   { id: 3, name: "ATM 3", lat: 4.037590, lng: 9.687549},
  //   { id: 4, name: "ATM 4", lat: 4.035867, lng: 9.687420},
  //   { id: 5, name: "ATM 5", lat: 4.036263, lng: 9.694000},
  //   { id: 6, name: "ATM 6", lat: 4.048634, lng: 9.722817},
  //   { id: 7, name: "ATM 7", lat: 4.048236, lng: 9.725414},
  //   { id: 8, name: "ATM 8", lat: 4.037590, lng: 9.687549},
  // ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  //Fetch ATMs
  useEffect(() => {
    fetch(`${BASE_URL}/get_atms.php`)
      .then(res => res.json())
      .then(data => {
        if(data.success){
          setAtms(data.data);
        }else{
          Alert.alert("Error", "API call was not successful");
        }
      })
      .catch(error => {
        console.error("Failed to load ATM data: ", error);
        Alert.alert("Error", "Could not load ATM data");
      });
  }, []);

  if (!region) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {atms.map((atm) => (
          <Marker
            key={atm.id}
            coordinate={{ latitude: parseFloat(atm.lat), longitude: parseFloat(atm.lng) }}
            title={atm.name_and_loc}
          />
        ))}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

