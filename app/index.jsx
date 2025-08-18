import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapModel from '../components/MapModal';

export default function HomeScreen() {
  const [allAtms, setAllAtms] = useState([]);
  const [nearbyAtms, setNearbyAtms] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closestAtmId, setClosestAtmId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAtm, setSelectedAtm] = useState(null);
  const lastRegionRef = useRef(null);
  const BASE_URL = "http://192.168.100.6/atm-tracker-web/atm-api/api";

  //Get the user's current location
  useEffect(() => {
    async function setUp() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location access is required to show nearby ATMs.');
          setLoading(false);
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        const userLatitude = currentLocation.coords.latitude;
        const userLongitude = currentLocation.coords.longitude;
        setRegion({
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });


        //Fetch ATMs from the server
        const response = await fetch(`${BASE_URL}/get_atms.php`);
        const data = await response.json();

        if (!data.success) {
          Alert.alert('Error', 'Could not load ATMs from the server. Please try again later.');
          return;
        }



        const formattedAtms = formatAtms(data.data, userLatitude, userLongitude);
        const { closestId, closestAtm } = getClosestAtm(formattedAtms, userLatitude, userLongitude);

        setAllAtms(formattedAtms);
        setNearbyAtms(getNearbyAtms(formattedAtms, {
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        } ));

        setClosestAtmId(closestId);
        if (closestAtm) {
          setSelectedAtm(closestAtm);
          setModalVisible(true);
          setRegion({
            latitude: closestAtm.lat,
            longitude: closestAtm.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        }

      } catch (error) {
        Alert.alert('Error', error.message,)
      } finally {
        setLoading(false);
      }
    }

    setUp();
  }, []);


 const handleRegionChange = useCallback((newRegion) => {
  if (!lastRegionRef.current) {
    lastRegionRef.current = newRegion;
    return;
  }

  // For center movement
  const latDiff = Math.abs(newRegion.latitude - lastRegionRef.current.latitude);
  const lonDiff = Math.abs(newRegion.longitude - lastRegionRef.current.longitude) *
                Math.cos((newRegion.latitude * Math.PI) / 180);

  // For change in zoom level
  // const latDeltaDiff = Math.abs(newRegion.latitudeDelta - lastRegionRef.current.latitudeDelta);
  // const lonDeltaDiff = Math.abs(newRegion.longitudeDelta - lastRegionRef.current.longitudeDelta) *
  //                    Math.cos((newRegion.latitude * Math.PI) / 180);

  const threshold = 0.002;     
  // const deltaThreshold = 0.001; 

  if (
    latDiff < threshold &&
    lonDiff < threshold 
    // latDeltaDiff < deltaThreshold &&
    // lonDeltaDiff < deltaThreshold
  ) {
    return; 
  }

  setNearbyAtms(getNearbyAtms(allAtms, newRegion));
  setRegion(newRegion);
  lastRegionRef.current = newRegion;
}, [allAtms]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Unable to determine your location. Please enable GPS.</Text>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={(region) => handleRegionChange(region)}
      >
        {nearbyAtms.map((atm) => {
          const isClosest = atm.id === closestAtmId;
          return (
            <Marker
              key={atm.id}
              coordinate={{
                latitude: atm.lat,
                longitude: atm.lng
              }}
              onPress={() => {
                setSelectedAtm(atm);
                setModalVisible(true);
              }}
              title={atm.name_and_loc}
            >
              <Image
                source={isClosest ? require('../assets/images/atm-green.png') : require('../assets/images/atm-blue.png')}
                style={{
                  width: isClosest ? 40 : 35,
                  height: isClosest ? 40 : 35,
                }}
              />
            </Marker>
          )
        })}


      </MapView>

      {/* <View style={{backgroundColor: 'blue', width: '100%', height: 300}}> */}
      <MapModel
        visible={modalVisible}
        atmData={selectedAtm}
        onClose={() => setModalVisible(false)}
        expanded={false}
      />
      {/* </View> */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});


function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


function formatAtms(atms, userLatitude, userLongitude) {
  return atms.map(atm => {
    const latitude = parseFloat(atm.lat);
    const longitude = parseFloat(atm.lng);
    const google_maps_url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}(${encodeURIComponent(atm.name_and_loc)})`;
    const distance = calculateDistance(userLatitude, userLongitude, latitude, longitude);
    return {
      ...atm,
      distance,
      google_maps_url,
      lat: latitude,
      lng: longitude,
    };
  });
}

export function getClosestAtm(atms, userLatitude, userLongitude) {
  let closestId = null;
  let closestDistance = Infinity;
  let closestAtm = null;

  atms.forEach(atm => {
    const distance = calculateDistance(userLatitude, userLongitude, atm.lat, atm.lng);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = atm.id;
      closestAtm = atm;
    }
  });

  return { closestId, closestAtm };
}

function getNearbyAtms(atms, region) {
  return atms.filter(atm => isAtmInBounds(atm, region));
}

function isAtmInBounds(atm, region) {
  if (!region) return false;
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const latMin = latitude - latitudeDelta / 2;
  const latMax = latitude + latitudeDelta / 2;
  const lonMin = longitude - longitudeDelta / 2;
  const lonMax = longitude + longitudeDelta / 2;

  return (
    atm.lat >= latMin && atm.lat <= latMax &&
    atm.lng >= lonMin && atm.lng <= lonMax
  );
}

