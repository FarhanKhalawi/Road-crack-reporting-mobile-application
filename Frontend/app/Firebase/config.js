// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFoe8y_NP2TLsWKUpLYFfRpJA3nOjqCMM",
  authDomain: "road-crack-r.firebaseapp.com",
  projectId: "road-crack-r",
  storageBucket: "road-crack-r.appspot.com",
  messagingSenderId: "82426432988",
  appId: "1:82426432988:web:33daa66eee134e75b1d319"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export default app;

