import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList
} from 'react-native';
import {useRouter} from 'expo-router';
import CustomMainButton from './../../components/CustomMainButton';
import CustomCouponCard from '../../components/CustomCouponCard';
import {responsivePixelSize} from "../../../config/responsivePixelSize";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Benefits from '../benefits';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const Home = () => {


    const auth = getAuth();
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const [bottomSheetContent, setBottomSheetContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [benefitsData, setBenefitsData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleCloseModalPress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);


    const handleOpenModalPress = useCallback((contentType: string) => {
        setBottomSheetContent(contentType)
        bottomSheetRef.current?.expand();
    }, []);

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
    // const benefitsData = [
    //     {
    //         id: '1',
    //         company_name: 'CIRCLE K',
    //         title: 'Gratis kaffe',
    //         expirationDate: new Date(2024, 5, 31, 23, 59, 59),
    //         price: 25,
    //         logoUri: require('./../../../assets/Circlek.png'),
    //         description: 'Benytt denne kupongen på enhver Circle K-stasjon for å nyte en kostnadsfri kaffe',
    //         active: true,
    //         used: false
    //     },
    //     {
    //         id: '2',
    //         company_name: 'SIA',
    //         title: '50 Kr - kantine',
    //         expirationDate: new Date(2024, 6, 31, 23, 59, 59),
    //         price: 100,
    //         logoUri: require('./../../../assets/Sia.png'),
    //         description: 'Benytt denne kupongen på enhver SIA for å nyte en kostnadsfri kaffe', // change description
    //         active: true,
    //         used: false
    //     },


//     // ];

//     function formatDate(date: Date) {
//         let day: string | number = date.getDate();
//     let month: string | number = date.getMonth() + 1;
//         let year = date.getFullYear();

//          day = day < 10 ? '0' + day : day;
//         month = month < 10 ? '0' + month : month;

//        return `${day}.${month}.${year}`;
//  }
  
  // const activeBenefitsData = benefitsData.filter(item => item.active && !item.used);

    const renderBottomSheetContent = () => {
        switch (bottomSheetContent) {
            case 'camera':
                return (<View style={styles.BottomSheetContent}>
                    <Text style={styles.BottomSheetTitleText}>Rapporter Skade med bilde</Text>
                    <Text style={styles.BottomSheetBodyText}><Text style={{fontWeight: 'bold'}}>1. Fang Skaden
                    </Text>: Trykk på denne knappen for å aktivere
                        enhetens kamera. Rett kameraet mot
                        veiskaden og ta et klart bilde. Sørg for at skaden er synlig og godt belyst.</Text>
                    <Text style={styles.BottomSheetBodyText}><Text style={{fontWeight: 'bold'}}>2. Gjennomgå & Send
                        Inn</Text>: Etter at du har tatt bildet, vil
                        du ha muligheten til å gjennomgå
                        det. Hvis bildet tydelig viser skaden, send det inn. Hvis ikke, kan du ta bildet på nytt for å
                        sikre at det nøyaktig representerer problemet.</Text>
                </View>);
            case 'upload':
                return (<View style={styles.BottomSheetContent}>
                    <Text style={styles.BottomSheetTitleText}>Last opp Bilde fra Biblioteket</Text>
                    <Text style={styles.BottomSheetBodyText}><Text style={{fontWeight: 'bold'}}>1. Velg et Bilde
                    </Text>: Trykk på denne knappen for å velge et
                        bilde av bildebiblioteket på enheten din. Velg et bilde som tydelig viser veiskaden.</Text>
                    <Text style={styles.BottomSheetBodyText}><Text style={{fontWeight: 'bold'}}>2. Legg til Informasjon
                    </Text>: Etter å ha valgt et bilde, vil du
                        bli bedt om å legge til tilleggsinformasjon. Dette inkluderer geolokasjon og typen skade. Å
                        fylle ut denne informasjonen nøyaktig er viktig for at rapporten din skal behandles
                        effektivt.</Text>
                </View>);
            default:
                return <Text>Awesome 🎉</Text>;
        }
    };


    const handlePress = (route: string) => {
        router.push(route);
    };

    const handleCouponPress = (route: string, logoUri: any, title: string, id: any) => {
        router.push({
            pathname: route,
            params: {logoUri, title, id}
        });
    };
    const fechbenefitss = async()=>{
        setIsRefreshing(true);
        const db = getFirestore();
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid); // Referanse til dokumentet som tilhører den innloggede brukeren
                getDoc(userDocRef).then(docSnapshot => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data(); // Brukerdataene for den innloggede brukeren
                        // Her kan du gjøre hva du vil med brukerdataene, for eksempel hente aktive kuponger
                        const activeForUserID = userData.activeForUserID;
                        setBenefitsData(activeForUserID);
                    } else {
                        console.log("User document does not exist");
                    }
                }).catch((error: any) => {
                    console.error("Error fetching user document:", error);
                });
            } else {
                console.log("No user logged in");
            }
        });
        setIsRefreshing(false);

        return () => unsubscribe();

      
    }

     // Fetch benefits from Firestore
     const firestore = getFirestore();
     useEffect(() => {
        fechbenefitss();
       
    }, [auth]);
    
     
        
    return (
        
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Updated to use handlePress */}
                <CustomMainButton onPress={() => handlePress('/camera')} title={'Ta bilde'} iconName={'camera'}
                                  onInfoPress={() => handleOpenModalPress('camera')}/>
            </View>

            <View style={styles.content}>
                {/* Updated to use handlePress */}
                <CustomMainButton onPress={() => handlePress('/last_opp')} title={'Last opp bilde'}
                                  iconName={'add-photo-alternate'} onInfoPress={() => handleOpenModalPress('upload')}/>
            </View>

            <Text style={styles.text}>Aktiverte kuponger</Text>
          
            <FlatList
           
              refreshing={isRefreshing}
               //@ts-ignore
              onRefresh={fechbenefitss}
                data={benefitsData}
                 //@ts-ignore
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
        <CustomCouponCard
            type="active"
              //@ts-ignore
            title={item.title}
              //@ts-ignore
            expirationDate={item.expirationDate}
              //@ts-ignore
            price={item.price.toString()}
            //@ts-ignore
            image={item.logoUri}
              //@ts-ignore
            onPress={() => handleCouponPress('/usecoupon', item.logoUri, item.title, item.id)}
        />

    )}
/>

            


            <BottomSheet
                ref={bottomSheetRef}
                enablePanDownToClose={true}
                enableOverDrag={true}
                snapPoints={snapPoints}
                index={-1}
                bottomInset={46}
                detached={true}
                style={{marginHorizontal: 20}}
                backgroundStyle={{backgroundColor: "rgb(72,72,72)"}}
                handleIndicatorStyle={{backgroundColor: "rgb(137,137,137)"}}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={styles.BottomSheetContentContainer}>
                    {renderBottomSheetContent()}
                </BottomSheetView>
            </BottomSheet>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D2D2D',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 160,
    },
    content: {
        alignItems: 'center',
        marginBottom: 40,
    },
    text: {
        color: '#ffffff',
        fontSize: responsivePixelSize(20),
        fontWeight: 'bold',
        textAlign: 'left',
    },

    BottomSheetContentContainer: {
        flex: 1,
        alignItems: 'center',
    },

    BottomSheetContent: {
        padding: 20,
    },
    BottomSheetTitleText: {
        color: '#ffffff',
        fontSize: responsivePixelSize(18),
        fontWeight: 'bold',
        marginBottom: 10,
    },
    BottomSheetBodyText: {
        color: '#ffffff',
        fontSize: responsivePixelSize(16),
        marginTop: 10,
    }
});

export default Home;