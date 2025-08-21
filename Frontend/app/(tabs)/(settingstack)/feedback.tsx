import React, { useState } from 'react';
import {ScrollView} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform, TextInput
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import CustomTextInput from "./../../components/CustomTextInput";
import {responsivePixelSize} from "../../../config/responsivePixelSize";
import CustomButton from "./../../components/CustomButton";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from '@firebase/firestore';

const feedback = () => {
  const navigation = useNavigation();
  const [feedbackText, setFeedbackText] = useState('');



  const saveData = async () => {
    const auth = getAuth();
    const db = getFirestore();

    if (auth.currentUser) {
      try {
        // Legg til tilbakemeldingen i Firebase-databasen
        const feedbackRef = collection(db, 'feedback');
        await addDoc(feedbackRef, {
          userId: auth.currentUser.uid,
          feedbackText: feedbackText,
          timestamp: serverTimestamp()
        });
        
        Alert.alert(
          'Tilbakemelding sendt',
          'Takk for din tilbakemelding!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('Feil ved lagring av tilbakemelding:', error);
        // Vis en feilmelding til brukeren om nødvendig
      }
    } else {
      console.log('Ingen bruker logget inn.');
      // Håndter tilfeller der ingen bruker er logget inn
    }
  };
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.rootContainer}>
        <Image
          source={require('../../../assets/RCR_Icon.png')}
          style={styles.logo}
        />
         <Text style={styles.title}>Takk For At Du Hjelpe Oss å Bli Bedre!</Text>
         <Text style={styles.title1}>Har du noen tilbakemeldinger? Del dine ideer</Text>
         <Text style={styles.title1}>og erfaringer med oss for å hjelpe oss å</Text>
         <Text style={styles.title1}>forbedre vår service og våre veier.</Text>
       
         

         <View style={styles.inputsContainer}>
         <Text style={styles.inputLabel}>Tilbakemelding</Text>
         <TextInput
             style={styles.input}
             onChangeText={setFeedbackText}
                  multiline
                          />
         
             
              
          </View>

          <CustomButton title={"Sende inn"} onPress={saveData} />
          
          
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  rootContainer:{
    alignItems: 'center',
  },
  
  logo: {
    width: 140,
    height: 157.5,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  
  inputsContainer: {
    gap: 28,
    top: 30,
    marginBottom: 90,

  },
  
  title: {
    
    fontSize: responsivePixelSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF', 
    alignSelf: 'center',
    marginBottom: 20
    
  },
  title1: {
    fontSize: responsivePixelSize(16),
    color: '#FFF', 
    alignSelf: 'center',
    fontWeight: 'normal'
  },
  input: {
    backgroundColor: '#FFF', // White background for input
    borderRadius: 20,
    minWidth: 365,
    minHeight: 150, // Minimum height for the input
    textAlignVertical: 'top', // Align text to the top
    borderColor: '#FFCC00', // Border color
    borderWidth: 1,
    padding:20
  },
  inputLabel: {
    fontSize: responsivePixelSize(20),
    color: '#FFCC00',
    marginBottom: -28,
    marginLeft: 15,
    marginTop: 20
  },


});

export default feedback;