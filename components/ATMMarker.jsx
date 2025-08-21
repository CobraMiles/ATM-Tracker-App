import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

export default function ATMMarker({ atm, isClosest, isSelected, onPress }) {
  // Determine color based on status
  let color = "gray"; // default (unknown)
  if (atm.online) color = "green";
  else if (!atm.online) color = "red";
  if (isClosest) color = "blue";
  if (isSelected) color = "gold";

  return (
    <Marker coordinate={{ latitude: atm.lat, longitude: atm.lng }} onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.circle, { borderColor: color }]}>
          <Text style={[styles.text, { color }]}>ATM</Text>
        </View>
        <View style={[styles.triangle, { borderTopColor: color } ]}
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  text: {
    fontWeight: "bold",
    fontSize: 8,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -4,
  },
});


