import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, // Ensure Keyboard is imported
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    imageUri: '../../assets/profile.png', // Replace with your default image URI
    userName: 'Laila',
    email: 'Emailmmmm@gmail.com',
    phone: '+47 411 064 52',
    password: '••••••••', // Placeholder for display, real password should not be fetched or displayed
  });
  
  

  const handleEdit = () => {
    
    router.push('/edit_profile');

  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts behavior based on platform
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // You might need to adjust this value
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Image
          
          source={require('../../../assets/profile.png')}
            style={styles.profileImage}
            
            
          />
           <View style={styles.nameRow}>
            <TouchableOpacity onPress={handleEdit}>
              <MaterialIcons name="edit" size={30} color="black" />
            </TouchableOpacity>
          </View>

          
           {/* name Label and Input */}
        <Text style={[styles.inputLabel, { top: 315, left: 170 }]}>User Navn:</Text>
        <Text style={[styles.inputLabel, { top: 335, left: 185 , color: '#FFE787'}]}> {user.userName}</Text>    
          
      

        {/* e-mail Input */}
        <Text style={[styles.inputLabel, { top: 424 }]}>E-Mail:</Text>
        <Text style={[styles.inputLabel, { top: 454 , color: '#FFE787'}]}>{user.email}</Text>
        <View style={[styles.line,{top: -50}]} />
          
        

        {/* phon Input */}
        <Text style={[styles.inputLabel, { top: 508 }]}>Mobile Nummeret:</Text>
        <Text style={[styles.inputLabel, { top: 535 , color: '#FFE787' }]}>{user.phone}</Text>
        <View style={[styles.line,{top: 15}]} />
        
        

        
        {/* Password Label and Input */}
        <Text style={[styles.inputLabel, { top: 595 }]}>Passord: </Text> 
        <Text style={[styles.inputLabel, { top: 620 , color: '#FFE787'}]}>{user.password}</Text> 
  

        
        
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  profileImage: {
    width: 185,
    height: 200,
    top: -160, 
    borderRadius: 106.59,
    alignSelf: 'center',
  },
  
  inputLabel: {
    color: '#000000',
    left: 20, 
    fontSize: 16,
    position: 'absolute',
  },
  
  nameRow: {
    left: 150,
    top: -400,
    margin: 10, // Add some margin around the row for spacing
    marginBottom: 40,
  },

  line: { // Style for the line under each text
    borderBottomColor: '#FFE787', // Color of the line
    borderBottomWidth: 1, // Thickness of the line
    alignSelf: 'stretch', // Make line take up the full width available
    marginLeft: 20, // Align left edge of line with the text
    marginRight: 20, // Add right margin if necessary
    marginBottom: 16, // Space between the line and the next text entry
  },

});

export default ProfileScreen;
