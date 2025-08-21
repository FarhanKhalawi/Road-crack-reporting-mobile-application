import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, ActivityIndicator, Alert
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from "expo-location";
import {useNavigation} from "expo-router";
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  type Coordinate = {
    latitude: number;
    longitude: number;
  };
  const [pin, setPin] = useState<Coordinate | null>(null);

  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setPin({
      latitude,
      longitude,
    });
  };

  useEffect(() => {
    (async () => {

      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const saveData = () => {
    // Handle the save action here
    console.log(description);
    Alert.alert(
      'Viktig melding', // Title of the alert
      'Takk! Du har sendt bilde av veiskader. Fortsett det gode arbeidet og bidra til å forbedre våre veier!', // Message
      [
        { text: 'Godt', onPress: () => navigation.goBack() } // Array of buttons
      ],
      { cancelable: false } 
    );
    
  };
  const alternatives = [
    { label: 'Hull', value: 'hull' },
    { label: 'Erosjon', value: 'erosjon' },
    { label: 'Sprukket asfalt', value: 'sprukket_asfalt' },
    { label: 'Vannsamlinger', value: 'vannsamlinger' },
    { label: 'Dårlig veddlikehold', value: 'dårlig_veddlikehold' },
    { label: 'Underdimensjonerte veier', value: 'underdimensjonerte_veier' },
    { label: 'Trafikktetthet og slitasje', value: 'vannsamlinger' },
    // ... add other items as needed
  ];

  

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.label}>Send feil</Text>
          <AntDesign style={[styles.Icon, { top: 115 }]} name="down" size={20} color="#FFE787" />
          <RNPickerSelect
            onValueChange={(value) => setDescription(value)}
            items={alternatives}
            style={pickerSelectStyles}
            placeholder={{ label: "Velg et alternativ...", value: null,  }}
            value={description}
            
          />
          <Text style={styles.title}>1. Velg et alternativ listet ovenfor som passer ditt behov.</Text>
          <Text style={styles.title}>2. Zoom inn på kartet eller bruk pilene for å finne og velge den nærmeste posisjonen.</Text>
          <Text style={styles.positionText}>Posisjon:</Text>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              userLocationPriority={"passive"}
              onPress={handleMapPress}
            >
              {pin && <Marker coordinate={pin} />}
            </MapView>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          <TouchableOpacity style={styles.button} onPress={saveData}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#999999',
  },
  map: {
    width: '100%',
    flex: 1,
    marginBottom: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 30,
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFCC00',
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    width: '70%',
    height: '6%',
    marginLeft: 10,
    marginBottom: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#B7B7B7',
  },
  button: {
    top: 15,
    marginBottom: 30,
    width: 259,
    height: 44,
    backgroundColor: '#48484A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  positionText: {
    fontSize: 18,
    top: 60,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 65,
  },
  title: {
    top: 30,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#48484A',
    alignSelf: 'flex-start', 
    marginLeft: 10,
},
Icon: {
  position: 'absolute',
  right: 125,
},
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFCC00',
    borderRadius: 20,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: '70%',
    marginLeft: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFCC00',
    borderRadius: 20,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: '70%',
    marginLeft: 10,
  },

  // Add any other styles that you need for your picker
});