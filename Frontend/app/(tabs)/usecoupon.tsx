import React, { useCallback, useId, useState } from 'react';
import {ScrollView, StyleSheet, Text, View, Alert, Image, FlatList} from 'react-native';
import {responsivePixelSize} from "../../config/responsivePixelSize";
import CustomCouponCard from '../components/CustomCouponCard';
import CustomButton from './../components/CustomButton';
import {useLocalSearchParams, useRouter} from 'expo-router';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const Usecoupon = () => {
    const router = useRouter();
    const {logoUri, title, id} = useLocalSearchParams();
    const db = getFirestore(); // Initialize Firestore
    const auth = getAuth();


    const handlePress1 = (route: string) => {
        router.push(route);
    };

    const handlePress = async (route: string, 
    ) => {
     
        onAuthStateChanged(auth, async user => {
            if (user && user.uid) {
                // Reference to the document where the array is stored
                const userDocRef = doc(db, 'users', user.uid);
    
                // Fetch the document to get the current array
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    //@ts-ignore
                    const newArray = userData.activeForUserID?.filter(coupon => coupon.id !== id);  // Assuming 'coupons' is the array and each has an 'id'
    
                    // Update the document with the new array
                    await updateDoc(userDocRef, {
                        activeForUserID: newArray
                    }).then(() => {
                        console.log('Coupon deleted successfully');
                        router.push(route);
                    }).catch(error => {
                        console.error("Error updating coupons:", error);
                    });
    
                } else {
                    console.log("No document found!");
                }
            } else {
                console.error("No user found or user lacks 'activeForUserID'");
            }
        });
}
    const Data = () => {

        Alert.alert(
            'Bekreft Bruk av Kupong',
            'Ønsker du å bruke denne kupongen nå? Vis denne meldingen til kassebetjenten før du bekrefter. Husk at kupongen kun kan brukes én gang.', // Message
            [
                {text: 'Avbryt', onPress: () => handlePress1('/home')},
                {text: 'Bruk Kupong', onPress: () => handlePress('/home')},

            ],
            {cancelable: false}
        );

    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setBarStyle('default');
            };
        }, [])
    );


    return (
        <>
      
        <View style={styles.container}>

                {/*@ts-ignore*/}
                <Image source={{uri: logoUri}} style={styles.imageStyle} resizeMode='contain'/>
                <Text style={styles.title}>{title}</Text>
            
            <View style={styles.button}>
                <CustomButton title={"BRUK"} onPress={Data}/>
            </View>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
     paddingTop: 200,
        
alignItems:'center', 
   },

    imageStyle: {
        width: responsivePixelSize(300),
        height: responsivePixelSize(300),

      
    },
    button: {
        paddingTop: 110,
        alignItems: 'center',
        flex: 1,
    },
    title:{
        fontSize: 40,
        fontWeight: 'bold',

    }

});

export default Usecoupon;