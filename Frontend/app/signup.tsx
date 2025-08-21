import React, {useState} from 'react';
import {Platform, ScrollView} from 'react-native';
import {
    StyleSheet,
    View,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

import {useNavigation, useRouter} from 'expo-router';
import CustomTextInput from "./components/CustomTextInput";
import {responsivePixelSize} from "../config/responsivePixelSize";
import CustomButton from "./components/CustomButton";


const SignUpScreen = () => {
    const router = useRouter();
    const [isLoadingLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // For displaying error messages
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [isAnyError, setIsAnyError] = useState(false);
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSignUp = async () => {
        setEmailError('');
        setPasswordError('');
        setFirstName('');
        setLastName('');

        let _error = false; //local error
        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            setIsAnyError(true); // for tekst input and for try scoop
            _error = true;
        }


        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
        }
        if (!firstName.trim()) {
            setFirstNameError('First name is required');
            _error = true;
        }

        // Last name validation
        if (!lastName.trim()) {
            setLastNameError('Last name is required');
            _error = true;
        }
        if (!_error) {

            router.push({
                pathname: '/privacypolicy',
                params: {email, password, firstName, lastName},
            });
        }
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 1}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView style={styles.container} contentContainerStyle={styles.rootContainer}>
                    <Image
                        source={require('../assets/RCR_Icon.png')}
                        style={styles.logo}
                    />

                    <View style={styles.inputsContainer}>
                        {/* Email Label and Input */}
                        <CustomTextInput title={"Epost"} placeholder={""} keyboardType={"email-address"}
                                         icon={"mail-outline"} onChangeText={setEmail} errorMessage={emailError}
                                         error={isAnyError}/>

                        {/* First name Label and Input */}
                        <CustomTextInput title={"Fornavn"} placeholder={""} keyboardType={"default"}
                                         secureTextEntry={false} icon={"person-outline"} onChangeText={setFirstName}
                                         errorMessage={firstNameError} error={isAnyError}/>


                        {/* Last name Label and Input */}
                        <CustomTextInput title={"Etternavn"} placeholder={""} keyboardType={"default"}
                                         secureTextEntry={false} icon={"person-outline"} onChangeText={setLastName}
                                         errorMessage={lastNameError} error={isAnyError}/>


                        {/* Password Label and Input */}
                        <CustomTextInput title={"Passord"} placeholder={""} keyboardType={"default"}
                                         secureTextEntry={true} icon={"eye-off-outline"} onChangeText={setPassword}
                                         errorMessage={passwordError} error={isAnyError}/>
                    </View>

                    <CustomButton title={"Registrer"} onPress={handleSignUp}/>


                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        fontSize: responsivePixelSize(14),
        alignSelf: 'center',
        top: 260,

    },
    errorMessage1: {
        color: 'red',
        fontSize: responsivePixelSize(14),
        alignSelf: 'center',
        top: 495,

    },
    container: {
        flex: 1,
        backgroundColor: '#2D2D2D',
    },
    rootContainer: {
        alignItems: 'center',
    },

    logo: {
        width: 140,
        height: 157.5,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 5,
    },

    inputsContainer: {
        gap: 28,
        top: 15,
        marginBottom: 80,

    },

});

export default SignUpScreen;
