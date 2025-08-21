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
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import CustomTextInput from "./components/CustomTextInput";
import {responsivePixelSize} from "../config/responsivePixelSize";
import CustomButton from "./components/CustomButton";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';


const Forget = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoadingLogin, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const handleForgetPassword = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log(email);
      setIsSubmitting(false);
    }, 2000);
  };

  const saveData = () => {
    // Handle the save action here
    sendPasswordResetEmail(auth, email)
    .then(() => {
        Alert.alert( 'Nullstillingstruksjoner Sendt', // Title of the alert
        'Vi har sendt deg en melding med instruksjoner om hvordan du kan tilbakestille passordet ditt. Vennligst hold et øye med innboksen din for e-posten.', // Message
        [
          { text: 'OK', onPress: () => navigation.goBack() } // Array of buttons
        ],
        { cancelable: false })})
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
            Alert.alert('Error!', "Uh-oh, looks like our fishing nets came up empty! We couldn't find any account swimming around with that email. Take another dive and make sure you're using the correct email address.");
        } else {
            Alert.alert('Error!', `Error: ${ error.code } ${ error.message }`);
        }
    });
    console.log(email);

    
  };

  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.rootContainer}>
        <Image
          source={require('../assets/RCR_Icon.png')}
          style={styles.logo}
        />
         <Text style={styles.title}>Oisann! Har du glemt passordet ditt? </Text>
         <Text style={styles.title1}>Ingen grunn til panikk – vi har alle vært der.</Text>
         <Text style={styles.title1}>skriv inn e-postadressen din, så sender vi deg</Text>
         <Text style={styles.title1}>en lenke slik at du kan tilbakestille passordet</Text>
         <Text style={styles.title1}>ditt.</Text>
         

         <View style={styles.inputsContainer}>
              {/* Email Label and Input */}
              <CustomTextInput title={"Epost"} placeholder={""} keyboardType={"email-address"}
                               icon={"mail-outline"} onChangeText={setEmail}/>
          </View>

          <CustomButton title={"Send lenken"} onPress={saveData} />
          
          
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
    marginBottom: 80,

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
  }

});

export default Forget;
