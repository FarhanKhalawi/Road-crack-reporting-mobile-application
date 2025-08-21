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
import CustomTextInput from "./../../components/CustomTextInput";
import {responsivePixelSize} from "../../../config/responsivePixelSize";
import CustomButton from "./../../components/CustomButton";
import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';


const change_password = () => {
  const navigation = useNavigation();
  const [Newpassword, setNewPassword] = useState('');
  const [Confirmpassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');



  const saveData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await updatePassword(user, Confirmpassword);
        } catch (error: any) {
            console.error("Error updating password: ", error);
            Alert.alert("Feil", "Kunne ikke oppdatere passordet: " + error.message);
        }
    } else {
        Alert.alert("Feil", "Ingen bruker er logget inn");
    }
    // Handle the save action here
        Alert.alert( 'Bekreft Nytt Passord', // Title of the alert
        'Er du sikker på at du vil endre passordet ditt? ', // Message
        [
          { text: 'Avbryt', onPress: () => navigation.goBack() },
          { text: 'Bekreft', onPress: () => navigation.goBack()  }
         
        ],)
    
  };

  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.rootContainer}>
        <Image
          source={require('../../../assets/RCR_Icon.png')}
          style={styles.logo}
        />
         <Text style={styles.title}>Ops! Trenger du å endre passordet?</Text>
         <Text style={styles.title1}>Ikke noe problem, det fikser vi.</Text>
         <Text style={styles.title1}>skriv inn ditt nye passord og bekreft det så tar</Text>
         <Text style={styles.title1}>vi oss av resten - Du vil motta en e-post når</Text>
         <Text style={styles.title1}>alt er på plass.</Text>
         

         <View style={styles.inputsContainer}>
             
              <CustomTextInput title={"Nytt passord"} placeholder={""} keyboardType={"default"}
                                     secureTextEntry={true} icon={"eye-off-outline"} onChangeText={setNewPassword} errorMessage={passwordError}  />
                                     
              <CustomTextInput title={"Bekreft nytt passord"} placeholder={""} keyboardType={"default"}
                                     secureTextEntry={true} icon={"eye-off-outline"} onChangeText={setConfirmPassword} errorMessage={passwordError}  />  
          </View>

          <CustomButton title={"Sett passord"} onPress={saveData} />
          
          
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
  }

});

export default change_password;
