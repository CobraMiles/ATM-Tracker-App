// import { Ionicons } from "@expo/vector-icons";

// import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import React, { useEffect, useRef, useState } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function MapModal({visible, onClose, atmData, expanded, onToggleExpand}){
//   if(!atmData) {
//     return null;
//   }
//   const atmOnline = atmData.online === 1
//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent
//     > 
//       <View style={styles.overlay} onPress={onClose}>
//         <View style={[styles.modalContainer, expanded && { maxHeight: '60%'}]}>
          

//           <View style={styles.header}>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="#000" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.titleRow}>
//             <Text style={styles.title}>{atmData.name_and_loc}</Text>
//             <View style={styles.statusRow}>
//               <Text style={styles.statusText}>{atmOnline ? 'Available' : 'Unavailable'}</Text>
//               <Ionicons name={atmOnline === 1 ? "checkmark-circle" : "close-circle"} size={16} color={atmOnline === 1 ? "green" : "red"} /> 
//             </View>
//           </View>

//           <Text style={styles.address}>{atmData.address}</Text>

//           <Text style={styles.distance}>{atmData.distance.toFixed(2)}</Text>
          
//           <TouchableOpacity
//             style={styles.directionsRow}
//             onPress={() => Linking.openURL(atmData.google_maps_url)}
//           >
//             <Ionicons name="navigate" size={20} color="blue" />
//             <Text style={styles.directionsText}>Directions</Text>
//           </TouchableOpacity>

//         </View>
//       </View>
//     </Modal>
//   )
// }





// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: "transparent"
//     //  'rgba(0, 0, 0, 0.25)'
//   },
//   modalContainer: {
//     backgroundColor: "white",
//     padding: 15,
//     borderTopLeftRadius: 10,
//     borderToRightRadius: 10,
//     maxHeight: '80%'
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//     justifyContent: 'flex-end'
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold'
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   statusText: {
//     marginRight: 5,
//   },
//   address: {
//     fontSize: 16,
//     color: '#333',
//     marginTop: 4
//   },
//   distance: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 4
//   },
//   directionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6
//   },
//   directionsText: {
//     marginLeft: 4,
//     color: 'blue',
//   },
// });


import { StyleSheet, Text, View, TouchableOpacity, Linking, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Roboto_400Regular } from '@expo-google-fonts/roboto/400Regular';
import { Roboto_500Medium } from '@expo-google-fonts/roboto/500Medium';
import { Roboto_600SemiBold } from '@expo-google-fonts/roboto/600SemiBold';
import { Roboto_700Bold } from '@expo-google-fonts/roboto/700Bold';
import { Roboto_800ExtraBold } from '@expo-google-fonts/roboto/800ExtraBold';
import { useFonts } from "expo-font";
import { useState } from "react";

export default function MapModal({visible, onClose, atmData, expanded, onToggleExpand}){
  const [isExpanded, setIsExpanded] = useState(expanded);
  let [fontsLoaded] = useFonts({ 
    Roboto_400Regular, 
    Roboto_500Medium, 
    Roboto_600SemiBold, 
    Roboto_700Bold, 
    Roboto_800ExtraBold, 
  });
  if(!atmData  || !visible) {
    return null;
  }
  const atmOnline = atmData.online === 1
  const styles = getStyles(fontsLoaded);
  return (
    // <View style={styles.overlay}>
   
        <View style={styles.modalContainer}>
          <View style={styles.closeButtonView}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.atmDetailsView}>
        <View style={styles.nameStatusView}>
          <Text style={styles.nameText}>{atmData.name_and_loc}</Text>
        </View>
        <View style={styles.statusView}>
            <Text style={styles.statusText}>{atmOnline ? 'Available' : 'Unavailable'}</Text>
            <Ionicons name={atmOnline ? "checkmark-circle" : "close-circle"} size={20} color={atmOnline ? "green" : "red"} />
          </View>
        <View style={styles.addressView}>
          <Text style={styles.addressText}>{atmData.address}</Text>
        </View>
        <View style={styles.distanceView}>
          <Text style={styles.distanceText}><Text style={styles.distance}>{atmData.distance.toFixed(2)} km </Text>away from your current location</Text>
          <View>
            <TouchableOpacity style={styles.directionsView} onPress={() => Linking.openURL(atmData.google_maps_url)}>
              <Ionicons name="navigate" size={20} color="blue" />
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>            
          </View>
        </View>
          {isExpanded && (
        <View style={styles.servicesView}>
          <Text style={styles.servicesText}>Services</Text>
          
          {atmData.services && atmData.services.length > 0 ? 
            (
              atmData.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceBullet}>•</Text>
                  <Text style={styles.serviceName}>{service}</Text>
                </View>
                )
              )
            ) :
            <Text style={styles.serviceName}>No services available</Text>
          }
        </View>
      )}
      </View>
      <View style={styles.expandContentIconView}>
        <TouchableOpacity>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#434040" onPress={() => setIsExpanded(!isExpanded)} />
        </TouchableOpacity>
      </View>
      </View>)      
    // </View>
}




function getStyles(fontsLoaded) {
  const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'red',
  },
  modalContainer: {
    position: "absolute",
    bottom: 20, // distance from bottom
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around'
    
  },
  closeButtonView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //backgroundColor: 'red',
    paddingTop: 5,
    marginRight: 8,
  },
  atmDetailsView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
    //backgroundColor: 'blue',
    maxWidth: '85%',
    columnGap: 5,
  },
  nameText: {
    width: '100%',
    fontSize: 23,
    fontFamily: fontsLoaded ? 'Roboto_600SemiBold' : 'System',
    marginRight: 5,
  },
  statusView: {
    flexDirection: 'row',
    //backgroundColor: 'orange',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: fontsLoaded ? 'Roboto_500Medium' : 'System',
    fontSize: 14,
    color: '#434040',
    marginRight: 5,
  },
  addressView: {
    //backgroundColor: 'green',
    marginTop: 20,
  },
  addressText: {
    fontSize: 16,
    fontFamily: fontsLoaded ? 'Roboto_400Regular' : 'System', 
    color: '#434040',
  },  
  distanceView: {
    //backgroundColor: 'yellow',  
    marginTop: 20,
  },

  distanceText: {
    fontSize: 16,
    fontFamily: fontsLoaded ? 'Roboto_400Regular' : 'System', 
    color: '#434040',
  },

  distance: {
    fontFamily: fontsLoaded ? 'Roboto_500Medium' : 'System', 
  },
  directionsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  directionsText: {
    color: 'blue',
    fontFamily: fontsLoaded ? 'Roboto_400Regular' : 'System',
    fontSize: 14,
    marginLeft: 3, 
  },
  servicesView: {
    marginTop: 20,
  },
  servicesText: {
    fontSize: 16,
    color: '#434040',
    fontFamily: fontsLoaded ? 'Roboto_500Medium' : 'System', 
    marginBottom: 3,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
  },
  serviceBullet: {
    fontSize: 25,
    color: '#434040',
    marginLeft: 20,
    marginRight: 5,
  },
  serviceName: {
    fontFamily: fontsLoaded ? 'Roboto_400Regular' : 'System', 
    fontSize: 16,
    color: '#434040',
    marginTop: 5,
  },
  expandContentIconView: {
    //backgroundColor: 'purple',
    justifyContent: 'flex-end',
  },



  
  });
  return styles;
}
