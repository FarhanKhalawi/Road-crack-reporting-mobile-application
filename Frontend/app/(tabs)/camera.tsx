import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
    Button,
    ActivityIndicator
} from 'react-native';
import { router, useNavigation } from 'expo-router';

import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import app from "../Firebase/config";
import { responsivePixelSize } from "../../config/responsivePixelSize";
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from '@firebase/firestore';
import * as Location from 'expo-location';


interface PhotoState {
    uri: string;
}

export default function App() {
    const navigation = useNavigation();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission, setPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState<PhotoState | null>(null);
    const cameraRef = useRef<Camera | null>(null);
    const [location, setLocation] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(true);  // New state to control visibility
    const [isUploading, setIsUpLoading] = useState(false);  // New state to control visibility


    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Location Permission', 'Permission to access location was denied');
            return null;
        }

        try {
            let location = await Location.getCurrentPositionAsync({});
            return location;
        } catch (error) {
            console.error("Location error: ", error);
            Alert.alert('Location Error', 'Could not fetch location');
            return null;
        }
    }


    const Homepage = () => {
        router.back();
    };

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const locationPermission = await Location.requestForegroundPermissionsAsync();

            //@ts-ignore
            setPermission(cameraPermission.status === 'granted' && locationPermission.status === 'granted');

            if (locationPermission.status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                //@ts-ignore
                setLocation(loc);
            }
            setCameraVisible(false);  // Automatically close camera if no permission


        })();
    }, []);
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    async function takePhoto() {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true, skipProcessing: true };
            const newPhoto = await cameraRef.current.takePictureAsync(options);
            setPhoto(newPhoto);
        }
    }

    const closeCamera = () => {
        setCameraVisible(false);
        cameraRef.current?.pausePreview;
        router.back(); // or navigate to a different screen if you have specific logic for that
    };

    const handleSavePressed = async (blob: any) => {
        setIsUpLoading(true);
        let path = null;
        const location = await getLocation(); // Få lokasjonsdata
        if (!location) {
            Alert.alert("Location Error", "Unable to fetch location.");
            setIsUpLoading(false);
            return;
        }
        const auth = getAuth(app); // Sørg for at du har initialisert Firebase Auth
        const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
        //@ts-ignore
        const photoBlob = await fetch(photo.uri).then(r => r.blob()); // Konverterer bildet til en blob

        const storage = getStorage(app);

        const storageRef = ref(storage, `photos/${userId}_${Date.now()}.jpeg`); // Oppdater filnavnet til å inkludere brukerens ID og bruk JPEG
        const snapshot = await uploadBytesResumable(storageRef, blob);
        const imageUrl = await getDownloadURL(snapshot.ref);
        // Lagre bilde i Storage
        const metadata = {
            contentType: 'image/jpeg',
        };
        await uploadBytes(storageRef, blob, metadata).then(snapshot => {
            path = snapshot.ref.fullPath;
        });

        // Lagre rapportinformasjon i Firestore
        const db = getFirestore(app);
        const reportRef = doc(db, "reports", `${userId}_${Date.now()}`);
        const reportData = {
            userId: userId,
            imageUrl: imageUrl, // Fullstendig sti til bildet i Storage
            timestamp: new Date(), // Dato for sending
            metadata: {
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            }
        };
        await setDoc(reportRef, reportData);
        uploadBytes(storageRef, photoBlob, metadata).then(async (snapshot) => {
            console.log('Uploaded a blob or file!');
            setIsUpLoading(false);
            Alert.alert(
                'Viktig melding',
                'Takk! Du har sendt bilde av veiskader. Fortsett det gode arbeidet og bidra til å forbedre våre veier!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setPhoto(null); // Resetter bilde-tilstanden
                            navigation.goBack(); // Antar at dette navigerer tilbake til kamera/hjemmesiden
                        }
                    }
                ],
                { cancelable: false }
            );

            // Oppdater poengene i Firestore
            const userDocRef = doc(getFirestore(app), "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const currentPoints = userDoc.data().totalpoeng || 0;
                await updateDoc(userDocRef, {
                    totalpoeng: currentPoints + 25
                });
                console.log("Poeng oppdatert med 25 poeng");
            }

        }).catch((error) => {
            console.error("Upload failed", error);
            Alert.alert("Feil", "Feil under opplasting av bildet.");
        });
    };

    if (photo) {
        return (

            <View style={styles.container}>


                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.firstButton} onPress={() => setPhoto(null)}>
                        <Text style={styles.buttonText}>Ta på nytt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondButton}></TouchableOpacity>
                    <TouchableOpacity style={styles.ThirdButton} onPress={handleSavePressed}>
                        {isUploading ? <ActivityIndicator size={"large"} color={"#FFCC00"} /> : <Text style={styles.buttonText}>Rapportere</Text>
                        }
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}></Camera>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={closeCamera} style={styles.firstButton}>
                    <Text style={styles.buttonText}>Avbrytt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondButton} onPress={takePhoto}>
                    <Image source={require('../../assets/disc.png')} style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ThirdButton}></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#2D2D2D',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 125,
        padding: 20,
    },

    button: {
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },

    cameraIcon: {
        width: 66,
        height: 66,
        borderRadius: 33,
    },

    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: responsivePixelSize(17),
    },

    firstButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    secondButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ThirdButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});
