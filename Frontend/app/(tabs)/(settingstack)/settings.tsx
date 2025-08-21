import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import {responsivePixelSize} from "./../../../config/responsivePixelSize";
import {useRouter} from 'expo-router';
import Dialog from 'react-native-dialog';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword  } from 'firebase/auth';


const Settings = () => {
  const router = useRouter();
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState(name); 
  const [email, setEmail] = useState('example@mail.com');
  const db = getFirestore();
  const [confirmedDelete, setConfirmedDelete] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setName(userData.firstName); // Oppdaterer 'name' til fornavnet fra Firestore
            setEmail(userData.email)
          } else {
            console.log('Brukerdokumentet finnes ikke i Firestore');
          }
        } catch (error) {
          console.error('Feil ved henting av brukerdata fra Firestore:', error);
        }
      } else {
        console.log('Ingen bruker logget inn');
      }
    };

    fetchUserData();
  }, []);
  const handleChange = async () => {
    const auth = getAuth(); // Sørg for at du har initialisert auth et sted i koden din

    // Oppdaterer lokal state
    setName(tempName);
    setShowEditNameDialog(false);
  
    // Sjekker om brukeren er logget inn
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Angi korrekt dokumentbane basert på din database struktur
  
      try {
        // Oppdaterer brukernavnet i Firestore
        await updateDoc(userDocRef, {
          firstName: tempName // Angi feltnavnet i Firestore, her antar vi det er 'name'
        });
        console.log("Navnet ble oppdatert i databasen");
      } catch (error) {
        console.error("Feil ved oppdatering av navn:", error);
        // Du kan også vise en feilmelding til brukeren her om nødvendig
      }
    } else {
      console.log("Ingen bruker logget inn");
      // Håndtere tilfeller der ingen bruker er logget inn
    }
  };

  const handleCancelEdit = () => {
    setShowEditNameDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };
  const [newPassword, setNewPassword] = useState('');

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        console.log("Kontoen ble slettet.");
        setShowDeleteDialog(false);
        router.push('/login'); // Navigate to login screen after logout
      } catch (error) {
        console.error("Feil ved sletting av konto:", error);
      }
    } else {
      console.log("Ingen bruker logget inn.");
      // Håndter tilfeller der ingen bruker er logget inn
    }
  };
  
  const logoutPress = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log("User logged out successfully");
 
        router.push('/login'); // Navigate to login screen after logout
    } catch (error) {
        console.error("Logout failed: ", error);
        // Optionally handle errors, e.g., show an error message to the user
    }
};


  const handlePasswordPress = async () => {
      router.push('/change_password');

      
  };
  const handleFeedbackPress = () => {
    router.push('/feedback');
    
};

  
    return (
     <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Hei, {name}</Text>
          <TouchableOpacity onPress={() => setShowEditNameDialog(true)}>
             <Ionicons name="pencil" size={20} color="#FFCC00" />
           </TouchableOpacity>
        </View>
        <Dialog.Container visible={showEditNameDialog}>
         <Dialog.Title>Endre Navn</Dialog.Title>
         <Dialog.Description>
           Skriv inn ditt nye navn.
         </Dialog.Description>
         <Dialog.Input 
          placeholder="Nytt navn"
          onChangeText={setTempName}
          value={tempName}
         />
         <Dialog.Button label="Avbryt" onPress={handleCancelEdit} />
         <Dialog.Button label="Lagre" onPress={handleChange} />
        </Dialog.Container>

        <Dialog.Container visible={showDeleteDialog}>
          <Dialog.Title>Bekreft sletting</Dialog.Title>
          <Dialog.Description>
            Er du sikker på at du vil slette kontoen din?
            Skriv ditt password
          </Dialog.Description>
          <Dialog.Input 
          placeholder=" Password"
          onChangeText={setPassword}
          value={password}
         />
          <Dialog.Button label="Avbryt" onPress={handleCancelDelete} />
          <Dialog.Button label="Slett" onPress={handleDeleteAccount} />
        </Dialog.Container>
        
        <Text style={styles.UnderheaderText}>{email}</Text>

        <TouchableOpacity style={styles.option} onPress={handlePasswordPress}>
          <Ionicons name="key-outline" size={26} color="white" />
          <Text style={styles.optionText}>Endre passord</Text>
          <Ionicons name="chevron-forward" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleFeedbackPress}>
          <MaterialIcons name="feedback" size={26} color="white" />
          <Text style={styles.optionText}>Tilbakemelding</Text>
          <Ionicons name="chevron-forward" size={26} color="white" />
        </TouchableOpacity>



        <TouchableOpacity style={styles.logoutButton} onPress={logoutPress}>
          <Ionicons name="log-out-outline" size={26} color="white" />
          <Text style={styles.logoutText}>Logg ut</Text>
          <Ionicons name="chevron-forward" size={26} color="white" />
        </TouchableOpacity>



        <TouchableOpacity onPress={() => setShowDeleteDialog(true)}>
          <Text style={styles.delete_account}>Slett konto</Text>
        </TouchableOpacity>

        


         </ScrollView>
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2D2D2D',
    },
    contentContainer: {
      flexGrow: 1,
    },

    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 20,
    },
    headerText: {
      fontSize: responsivePixelSize(22),
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: '#424242',
      marginBottom: 10,
      marginHorizontal: 20,
      
      
      
    },
    optionText: {
      fontSize: responsivePixelSize(18),
      color: '#FFFFFF',
      marginRight: 160,
    },
    delete_account: {
      color: '#FE3D2F',
      fontSize: responsivePixelSize(16),
      textDecorationLine: 'underline',
      alignSelf: 'center',

    },
    UnderheaderText: {
      fontSize: responsivePixelSize(10),
      color: '#FFFFFF',
      paddingHorizontal: 20,
      paddingBottom: 30,
      marginTop: -75
  
    },
    logoutButton: {
      backgroundColor: '#FE3D2F',
      marginTop: responsivePixelSize(350),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 20,
      marginHorizontal: 20,

    },
    logoutText: {
      fontSize: responsivePixelSize(18),
      color: '#FFFFFF',
      marginRight: 220,
    },
   
  });
  
  export default Settings;
  