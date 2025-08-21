import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { StatusBar } from 'react-native';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import CustomTextInput from "./components/CustomTextInput";
import { responsivePixelSize } from "../config/responsivePixelSize";
import CustomButton from "./components/CustomButton";

const Login = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const auth = getAuth();
    const [isAnyError, setIsAnyError] = useState(false);
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
             // @ts-ignore
            navigation.replace("(tabs)"); // Anta at "/hjem" er din hjemmeside rute
          } else {
            // Brukeren er ikke logget inn
            console.log("Ingen bruker er logget inn");
             
          }
        });
    
        // Opprydding funksjonen
        return () => unsubscribe();
      }, [navigation]);
    const handleLogin = async () => {

   
        // TODO: set isLoadingLogin to true before making the login request
        // display loading spinner on the button while the login is in progress

        setIsLoadingLogin(true);

        setEmailError('');
        setPasswordError('');

        let _error = false; //local error

        if (!validateEmail(email)) {
            setEmailError('Invalid email format');       
            setIsAnyError(true); // for tekst input and for try scoop
            _error = true;
            setIsLoadingLogin(false);

        }
        if (!email) {
            setEmailError('Please enter your email');
            setIsAnyError(true);
            _error = true;
            setIsLoadingLogin(false);

        }



        if (!password) {
            setPasswordError('Please enter your password');
            setIsAnyError(true);
            _error = true;
            setIsLoadingLogin(false);

        }


        if (!_error) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Login successful', userCredential.user);
                // TODO: set isLoadingLogin to false after the login request is completed
                // hide the loading spinner on the button
                setIsLoadingLogin(false);
                // @ts-ignore
                navigation.replace("(tabs)"); // Assuming "/tabs" is the correct path
            } catch (error) {
                setIsLoadingLogin(false);
          
            
                //@ts-ignore
                const errorCode = error.code;
                console.log (errorCode)
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
   
                    Alert.alert("Login Failed", "The email or password you entered is incorrect.");
                }
                                
                 else {
                   
                    Alert.alert("Login Failed", "An error occurred while trying to log in. Please try again.");
                }
            }
        }

    };

    const handleSignUp = () => {
        // Sign-up logic
        router.push('/signup'); // Replace with your sign-up route
    };

    const handleForgotPassword = () => {
        // Forgot password logic
        router.push('/forget_password'); // Replace with your forgot password route
    };

    return (
        <>
        <StatusBar barStyle="light-content" />
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView style={styles.container} contentContainerStyle={styles.rootContainer}>
                <Image
                    source={require('../assets/RCR_Icon.png')}
                    style={styles.logo}
                />
                <View style={styles.inputsContainer}>
                    {/* Email Label and Input */}
                    <CustomTextInput title={"Epost"} placeholder={"example@mail.com"} keyboardType={"email-address"}
                        icon={"mail-outline"} onChangeText={setEmail} errorMessage={emailError} error={isAnyError} />


                    {/* Password Label and Input */}
                    <CustomTextInput title={"Passord"} placeholder={"Password"} keyboardType={"default"}
                        secureTextEntry={true} icon={"eye-off-outline"} onChangeText={setPassword} errorMessage={passwordError} error={isAnyError} />
                </View>


                <Text style={styles.forgotPassword} onPress={handleForgotPassword}>Glemt passord?</Text>


                <CustomButton title={"Logg inn"} onPress={handleLogin} isLoading={isLoadingLogin} />



                <View style={styles.orContainer}>
                    <View style={{ flex: 1, backgroundColor: "#fff", height: 1 }} />
                    <Text style={styles.orText}>eller</Text>
                    <View style={{ flex: 1, backgroundColor: "#fff", height: 1 }} />
                </View>

                <Text style={styles.singup} onPress={handleSignUp}>Opprett ny bruker</Text>

            </ScrollView>
        </TouchableWithoutFeedback>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D2D2D',
    },

    rootContainer: {
        alignItems: 'center',
    },

    logo: {
        width: 200,
        height: 225,
        alignSelf: 'center',
        marginTop: 65,
        marginBottom: 35,
    },

    inputsContainer: {
        gap: 28,
    },

    forgotPassword: {
        color: '#FFCC00',
        fontSize: responsivePixelSize(16),
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
        marginTop: 8,
        marginRight: 20,
        marginBottom: 34,
    },

    singup: {
        color: '#FFCC00',
        fontSize: responsivePixelSize(24),
        textDecorationLine: 'underline',
    },

    orContainer: {
        width: responsivePixelSize(352),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 34,
        marginBottom: 34,
    },

    orText: {
        fontSize: responsivePixelSize(15),
        color: '#FFFFFF',
        marginLeft: 10,
        marginRight: 10,
    },


});

export default Login;
