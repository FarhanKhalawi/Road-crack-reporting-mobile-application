import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
;
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [Name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleSave = () => {
    
    console.log(email, Name, password, mobileNumber);
    router.push('/profile');
  };

  const handleSelectImagePressed = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
      <Image
          
          source={require('../../../assets/profile.png')}
            style={styles.profileImage}
            
            
          />
          <TouchableOpacity onPress={handleSelectImagePressed} style={[{ top: 5, left: 245 }]}>
                    <MaterialIcons name="add-photo-alternate" size={33} color="#48484A" />
          </TouchableOpacity>
      
       
        {/* Email Label and Input */}
        <Text style={[styles.inputLabel, { top: 240 }]}>User Navn:</Text>
        <TextInput
          style={[styles.input, { top: 260 , paddingLeft:10 }]}
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      

        {/* First Name Input */}
        <Text style={[styles.inputLabel, { top: 324 }]}>E-Mail:</Text>
        <TextInput
          style={[styles.input, { top: 345 , paddingLeft:10 }]}
          placeholderTextColor="#000000"
          value={Name}
          onChangeText={setUserName}
        />
        

        {/* Last Name Input */}
        <Text style={[styles.inputLabel, { top: 408 }]}>Mobile Nummeret:</Text>
        <TextInput
          style={[styles.input, { top: 430 , paddingLeft:10 }]}
          placeholderTextColor="#000000"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
        
        

        
        {/* Password Label and Input */}
        <Text style={[styles.inputLabel, { top: 495 }]}>Passord</Text> 
        <TextInput
          style={[styles.input, { top: 515 , paddingLeft:10  }]}
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={true} 
        />
  


      

        <TouchableOpacity style={styles.Button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999999',
  },
  profileImage: {
    width: 150,
    height: 168.75,
    top: 40, 
    borderRadius: 50,
    alignSelf: 'center',
    
  },
  input: {
    width: 304,
    height: 50,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#FFCC00',
    borderRadius: 20,
    backgroundColor: '#B7B7B7',
    position: 'absolute', 
  },
  Icon: {
    position: 'absolute',
    right: 70,
  },
  inputLabel: {
    color: '#000000',
    left: 70, 
    fontSize: 16,
    position: 'absolute',
  },
  Button: {
    top: 410,
    width: 259,
    height: 44,
    backgroundColor: '#48484A',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    alignSelf: 'center',
  },
  

});

export default SignUpScreen;
