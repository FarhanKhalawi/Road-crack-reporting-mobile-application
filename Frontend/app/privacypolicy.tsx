import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {responsivePixelSize} from "../config/responsivePixelSize";
import CustomButton from "./components/CustomButton";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import app from "./Firebase/config";


const PrivacyPolicyScreen = () => {
    const auth = getAuth();
    const router = useRouter();
    const {email, password, firstName, lastName} = useLocalSearchParams();
    const [isLoadingSignin, setIsLoadingSignin] = useState(false);


    const handleLogin = async () => {
        setIsLoadingSignin(true);
        try {
            // @ts-ignore
            const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
            const user = userCredential.user;
            const db = getFirestore(app)
            console.log('User created:', email, firstName, lastName);
            await setDoc(doc(db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                totalpoeng: 100,
            });


            setIsLoadingSignin(false);

        } catch (error) {
            setIsLoadingSignin(false);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            //@ts-ignore
            alert(error.massage); //show feil massage to client


        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Personvernverklæring</Text>
            <ScrollView contentContainerStyle={styles.rootContainer}>
                <Text style={styles.paragraphTitle}>Lorem ipsum dolor sit amet consectetur</Text>

                <Text style={styles.paragraph}>
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut venenatis
                    tellus in metus vulputate eu scelerisque felis imperdiet. Ac turpis egestas maecenas pharetra. In
                    aliquam sem fringilla ut morbi tincidunt augue interdum. Elit duis tristique sollicitudin nibh.
                    Mattis rhoncus urna neque viverra justo. Maecenas volutpat blandit aliquam etiam. Est pellentesque
                    elit ullamcorper dignissim cras tincidunt lobortis feugiat. Vel quam elementum pulvinar etiam non
                    quam lacus. Bibendum at varius vel pharetra vel turpis nunc eget lorem. Facilisi morbi tempus
                    iaculis urna. Purus semper eget duis at tellus at urna. Cum sociis natoque penatibus et magnis dis
                    parturient montes.
                </Text>

                <Text style={styles.paragraphTitle}>Sem nulla pharetra diam sit amet</Text>
                <Text style={styles.paragraph}>
                    Sem nulla pharetra diam sit amet. Netus et malesuada fames ac turpis egestas integer eget. Eget arcu
                    dictum varius duis at consectetur lorem donec massa. Ligula ullamcorper malesuada proin libero.
                    Egestas dui id ornare arcu odio ut. Vel eros donec ac odio. Convallis convallis tellus id interdum.
                    Nunc mi ipsum faucibus vitae aliquet. Facilisis magna etiam tempor orci eu lobortis. Neque sodales
                    ut etiam sit amet nisl purus in. Augue lacus viverra vitae congue eu consequat ac felis donec.
                    Tortor at auctor urna nunc id cursus metus. Montes nascetur ridiculus mus mauris vitae ultricies.
                    Eget gravida cum sociis natoque penatibus. Nisl suscipit adipiscing bibendum est. Velit sed
                    ullamcorper morbi tincidunt ornare massa eget egestas purus. Sit amet purus gravida quis blandit
                    turpis cursus.
                </Text>
                <Text style={styles.paragraphTitle}>Rutrum quisque non tellus orci ac auctor</Text>
                <Text style={styles.paragraph}>
                    Rutrum quisque non tellus orci ac auctor. Ut lectus arcu bibendum at varius vel pharetra vel.
                    Bibendum ut tristique et egestas quis ipsum. Bibendum enim facilisis gravida neque. Semper risus in
                    hendrerit gravida rutrum quisque non tellus. Purus ut faucibus pulvinar elementum integer enim. In
                    dictum non consectetur a erat nam at lectus. Morbi tristique senectus et netus. Id nibh tortor id
                    aliquet lectus proin nibh nisl. Morbi tempus iaculis urna id. Congue mauris rhoncus aenean vel elit
                    scelerisque. Vulputate ut pharetra sit amet. Enim ut tellus elementum sagittis. Nam libero justo
                    laoreet sit. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere morbi. Nec dui
                    nunc mattis enim ut tellus elementum. Ligula ullamcorper malesuada proin libero.

                </Text>
            </ScrollView>

            <TouchableOpacity style={styles.botton}>
                <CustomButton title={"Godta"} onPress={handleLogin} isLoading={isLoadingSignin}/>
            </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 30,
        backgroundColor: '#2D2D2D',
        paddingHorizontal: 12,
        alignItems: 'center',

    },
    rootContainer: {
        alignItems: 'center',
        marginBottom: 100
    },

    header: {
        top: 30,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#FFFFFF',
        alignSelf: 'center',
    },
    paragraphTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: "#fff",
    },
    paragraph: {
        marginTop: 12,
        fontSize: 14,
        textAlign: 'left',
        color: "#fff",
        padding: 8,
    },
    botton: {
        marginBottom: 80

    }

});

export default PrivacyPolicyScreen;
