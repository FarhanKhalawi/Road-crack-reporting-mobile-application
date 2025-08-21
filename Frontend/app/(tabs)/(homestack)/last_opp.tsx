import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView, Dimensions, TouchableOpacity, Image, ActivityIndicator, Modal, Button
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from "expo-router";
import {responsivePixelSize} from "../../../config/responsivePixelSize";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "../../components/CustomButton";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import app from "../../Firebase/config";
import { getAuth } from 'firebase/auth';

const {width, height} = Dimensions.get('window');


export default function App() {

    const navigation = useNavigation();

    const [issueType, setIssueType] = useState('');
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%"], []);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    type Coordinate = {
        latitude: number;
        longitude: number;
    };
    const [pin, setPin] = useState<Coordinate | null>(null);

    const handleMapPress = (e: any) => {
        const {latitude, longitude} = e.nativeEvent.coordinate;
        setPin({
            latitude,
            longitude,
        });
    };

    const handleSelectImagePressed = async (blob: any) => {
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

    const handleAddFilePressed = () => {
        Alert.alert(
            'Viktig melding',
            'Takk! Du har sendt bilde av veiskader. Fortsett det gode arbeidet og bidra til å forbedre våre veier!',
            [
                {text: 'Godt', onPress: () => navigation.goBack()}
            ],
            {cancelable: false}
        );
    }


    useEffect(() => {
        (async () => {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    useEffect(() => {
        console.log(errorMsg);
    }, [errorMsg]);

    const issueTypes = [
        {label: 'Hull', value: 'hull'},
        {label: 'Sprukket asfalt', value: 'sprukket_asfalt'},
    ];

    const handleLocationPressed = () => {
        bottomSheetRef.current?.expand();
    }

    const handlePictureRemove = () => {
        setImage(null);
    }

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const handleLocationSelected = () => {
        setShowMap(false);
    }
    const handleReportPressed = async () => {
        setIsUploading(true);
        const auth = getAuth(app); // Sørg for at du har initialisert Firebase Auth
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        if (!pin) {
            Alert.alert("Feil", "Posisjon må være valgt for å sende rapporten.");
            return;
        }
    
        // Objekt for å holde rapportdata
        let reportData = {
            metadata: { latitude: pin.latitude, longitude: pin.longitude },
            timestamp: new Date(),
            userId: userId,
        };
    
        // Hvis et bilde er valgt, last det opp først
        if (image) {
            try {
                const storage = getStorage(app);
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
                const snapshot = await uploadBytesResumable(storageRef, blob);
                const imageUrl = await getDownloadURL(snapshot.ref);
                //@ts-ignore
                reportData.imageUrl = imageUrl;
            } catch (error) {
                console.error("Feil under opplasting av bilde", error);
                Alert.alert("Opplastingsfeil", "Det var en feil med bildet ditt. Prøv igjen.");
                setIsUploading(false);
                return;
            }
        }
    
        // Legger til skadetype hvis valgt
        if (issueType && typeof issueType === 'string') {
            //@ts-ignore
            reportData.issueType = issueType;
        }
         // Lagrer rapportdata til Firestore
         // changing in firebase project 
         const db = getFirestore(app);
         try {
             const docRef = await addDoc(collection(db, "reports"), reportData);
             const userDocRef = doc(getFirestore(app), "users", userId);
             const userDoc = await getDoc(userDocRef);
             if (userDoc.exists()) {
                 const currentPoints = userDoc.data().totalpoeng || 0;
                 await updateDoc(userDocRef, {
                     totalpoeng: currentPoints + 25
                 });
                 console.log("Poeng oppdatert med 25 poeng");
             }
     
             Alert.alert(
                 'Rapport Sendt',
                 'Din rapport har blitt sendt. Takk for ditt bidrag!',
                 [{ text: 'OK', onPress: () => navigation.goBack() }],
                 { cancelable: false }
             );
         } catch (error) {
             console.error("Feil under lagring av rapport", error);
             Alert.alert("Lagringsfeil", "Det oppstod en feil under lagring av din rapport. Prøv igjen.");
         }
         setIsUploading(false);
    };
    
    return (
        <ScrollView style={{backgroundColor: '#2D2D2D'}} contentContainerStyle={styles.container}>

            {/* issue type */}
            <View style={styles.issueTypeContainer}>
                <Text style={styles.textHeader}>Skadetype</Text>
                <RNPickerSelect
                    onValueChange={(value) => setIssueType(value)}
                    items={issueTypes}
                    style={{
                        iconContainer: {top: 13, right: 10},
                        inputIOS: styles.issueBody,
                        inputAndroid: styles.issueBody,
                        placeholder: {color: '#898989'},
                    }}
                    placeholder={{label: "velg et alternativ...", value: null,}}
                    value={issueType}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                        return <Ionicons name="chevron-down-sharp" size={26} color="#FFCC00"/>
                    }}
                />
            </View>

            <View style={{paddingVertical: 18}}/>

            {/* picture */}
            <View style={styles.pictureRootContainer}>
                <Text style={styles.textHeader}>Bilde av skaden</Text>

                {image ? (
                    <View style={styles.pictureContainer}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.removeIcon} onPress={handlePictureRemove}>
                            <Ionicons name="close" size={40} color="#FE3D2F"/>
                        </TouchableOpacity>
                        <Image source={{uri: image}} style={{width: width - 60, height: width - 60, borderRadius: 10}}/>
                    </View>
                ) : (
                    <View style={styles.pictureContainer}>
                        <Text style={{color: '#fff', fontSize: responsivePixelSize(16)}}>ingen valgte bilde</Text>

                        <CustomButton title={"Velg bilde"}
                        //@ts-ignore
                         onPress={handleSelectImagePressed}/>
                    </View>
                )}

            </View>

            <View style={{paddingVertical: 18}}/>

            {/* location */}
            <View style={styles.locationRootContainer}>
                <Text style={styles.textHeader}>Posisjon av skaden</Text>

                <TouchableOpacity activeOpacity={0.8} style={styles.locationContainer} onPress={() => setShowMap(true)}>
                    {pin ? (
                        <Text style={{color: '#000000', fontSize: responsivePixelSize(16)}}>Festet posisjon</Text>
                    ) : (
                        <Text style={{color: '#898989', fontSize: responsivePixelSize(16)}}>Trykk for å velge
                            posisjon</Text>
                    )}

                </TouchableOpacity>
            </View>

            <View style={{paddingVertical: 18}}/>

            <View style={{width: "100%", height: 1, backgroundColor: '#fff'}}/>

            <View style={{paddingVertical: 32}}/>

            {/* report button */}
            <CustomButton isLoading={isUploading} title={"Rapportere"} disabled={!pin || (!image && !issueType) } onPress={handleReportPressed}
/>


            {/* map modal */}
            <Modal
                presentationStyle={"fullScreen"}
                animationType="slide"
                visible={showMap}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setShowMap(!showMap);
                }}>

                <View style={styles.mapModalRootContainer}>
                    <View style={styles.modalView}>
                        <View style={{padding: 20}}>
                            <Text style={{fontSize: responsivePixelSize(16), color: "#fff"}}>Zoom inn på kartet og trykk
                                for å markere nøyaktig posisjon med en nål/pin.</Text>
                        </View>
                        {location ? (
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                showsMyLocationButton={true}
                                userLocationPriority={"passive"}
                                onPress={handleMapPress}
                            >
                                {pin && <Marker coordinate={pin}/>}
                            </MapView>
                        ) : (
                            <ActivityIndicator size="large" color="#FFCC00"/>
                        )}
                        <View style={styles.buttonContainer}>
                            <CustomButton title={"velg"} disabled={pin === null} onPress={handleLocationSelected}/>
                        </View>
                    </View>
                </View>
            </Modal>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#2D2D2D',
        alignItems: 'center',
        padding: 20,
    },

    issueTypeContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },

    textHeader: {
        color: '#fff',
        fontSize: responsivePixelSize(18),
        fontWeight: 'bold',
        marginLeft: 4,
        marginBottom: 4,
    },

    issueBody: {
        width: width - 40,
        height: 52,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',

        fontSize: responsivePixelSize(16),
        paddingRight: 30,
    },

    pictureRootContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },

    pictureContainer: {
        width: width - 40,
        height: width - 40,
        borderRadius: 10,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#FFCC00',

        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    removeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 9999,

        backgroundColor: 'rgba(183,183,183,0.7)',
        borderRadius: 20,
    },

    locationRootContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },

    locationContainer: {
        width: width - 40,
        height: 52,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',

        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    mapModalRootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#484848',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
    },

    map: {
        width: "100%",
        flex: 1,
        backgroundColor: '#fff',
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 45,

    },
});