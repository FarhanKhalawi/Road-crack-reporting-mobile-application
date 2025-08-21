import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, Alert, Image, FlatList} from 'react-native';
import {responsivePixelSize} from "../../config/responsivePixelSize";
import CustomCouponCard from '../components/CustomCouponCard';
import CustomButton from './../components/CustomButton';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import {useRouter} from 'expo-router';
import {useNavigation} from "expo-router";
import { getFirestore, collection, query, getDocs, doc, updateDoc, getDoc, onSnapshot, arrayUnion, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Benefits = () => {

    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const [bottomSheetContent, setBottomSheetContent] = useState<any>({});
    const auth = getAuth();
    
    const [benefitsData, setBenefitsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalpoeng, setTotalPoeng] = useState<number>(0); // Starter med 50 poeng

    // Fetch benefits from Firestore
    useEffect(() => {
        const fetchBenefits = async () => {
            const db = getFirestore();
            const benefitsCollection = collection(db, 'Benefits');
            const benefitsQuery = query(benefitsCollection);
            const querySnapshot = await getDocs(benefitsQuery);
            const fetchedBenefits = querySnapshot.docs.map(doc => ({
                
                id: doc.id,
                ...doc.data()
            }));
            //@ts-ignore
            setBenefitsData(fetchedBenefits);
            setIsLoading(false);        };

        fetchBenefits();
    }, []);
    const firestore = getFirestore();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                const userRef = doc(firestore, 'users', user.uid);
                const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data();
                        setTotalPoeng(userData.totalpoeng || 0); // Update points from Firestore
                    } else {
                        console.log("Dokumentet finnes ikke!");
                    }
                }, (error) => {
                    console.error("Firestore error:", error);
                });

                return () => unsubscribeSnapshot(); // Cleanup snapshot listener
            }
        });

        return () => unsubscribeAuth(); // Cleanup auth listener
    }, [auth, firestore]);

    const redeemCoupon = async (price: any, id: any, ) => {
        if (auth.currentUser) {
    
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);

            const redeemedBenefits = userDoc?.data()?.activeForUserID || [];
           
            console.log(bottomSheetContent.id);
            console.log(redeemedBenefits);
            if (redeemedBenefits.id == bottomSheetContent.id) {

                Alert.alert("Allerede innløst", "Du har allerede innløst denne kupongen.");
                return;
            }
        
            if (totalpoeng >= price) {
            //@ts-ignore
            const newPoints = totalpoeng - price; // Deduct 25 points for a coupon
            
        
               
                await updateDoc(userRef, {
                    totalpoeng: newPoints,
                    activeForUserID: arrayUnion(bottomSheetContent), // Makes the benefit exclusive to this user
                });
            
                setTotalPoeng(newPoints); // Update local state
                bottomSheetRef.current?.close();

            } 


            else {
                Alert.alert("Ikke nok poeng", "Du har ikke nok poeng til å løse inn denne kupongen.");
            }
        }
    };


    type BottomSheetContentProps = {
        id: string;
        company_name: string;
        logoUri: string;
        title: string;
        price: number;
        description: string;
        active: string,
        used: string,
        expirationDate:any;
        
    }


    const handleOpenModalPress = useCallback((item: BottomSheetContentProps) => {
        const logoUri = item.logoUri || '';

        setBottomSheetContent(item)
        bottomSheetRef.current?.expand();
        
    },  []);

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

    const handlePress = (route: string) => {
        router.push(route);
    };


    

    const handleRedeemPress = () => {
        Alert.alert(
            'Bekreft Innløsning',
            `Er du sikker på at du ønsker å bruke ${bottomSheetContent.price} poeng for å innløse denne kupongen?`,
            [
                { text: 'Nei', onPress: () => {} },
                { text: 'Ja, innløs', onPress: () => 
                    //@ts-ignore
                    redeemCoupon(bottomSheetContent.price, bottomSheetContent.id) }
            ],
            { cancelable: false }
        
        );
        
    };

    const renderBottomSheetContent: React.FC<BottomSheetContentProps> = ({
                                                                             company_name,
                                                                             logoUri,
                                                                             title,
                                                                             price,
                                                                             description, 
                                                                         }) => {
        // if (!bottomSheetContent) return null;
        return (<View style={styles.BottomSheetContent}>

            <View style={styles.bottomSheetHeader}>
                {/*@ts-ignore*/}
                <Image source={{uri: logoUri}} style={styles.imageStyle} resizeMode='contain'/>
                <Text style={styles.BottomSheetTitleText}>{company_name}</Text>
            </View>

            <View style={styles.separator}/>

            <View style={styles.bottomSheetBody}>
                <Text style={styles.BottomSheetBodyText}>{title}</Text>
                <Text style={styles.BottomSheetBodyText}>pris: {price} poeng</Text>
            </View>

            <View style={styles.separator}/>

            <View style={styles.bottomSheetFooter}>
                <Text style={[styles.BottomSheetBodyText, {fontWeight: 'bold'}]}>Beskrivelse:</Text>

                <Text style={styles.BottomSheetBodyText}>{description}</Text>
            </View>




            <View style={styles.Bottom}>
                <CustomButton title={"Bytt"} 
                //@ts-ignore
                onPress={handleRedeemPress}/>
            </View>

        </View>);
    };
 


    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>Balanse</Text>
                <View style={styles.circle}>
                    <Text style={styles.pointsText}>{totalpoeng} 
                    <Text style={styles.poengText}>poeng</Text>
                    </Text>
                    
                </View>
            </View>
            <Text style={styles.balanceText}>Fordeler</Text>
            <FlatList
                data={benefitsData}
                 //@ts-ignore
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CustomCouponCard
            
                        type="price"
                         //@ts-ignore
                        title={item.title}
                         //@ts-ignore
                        expirationDate={item.expirationDate}
                         //@ts-ignore
                        price={item.price.toString()}
                         //@ts-ignore
                        image={item.logoUri }
                  
                        onPress={() => handleOpenModalPress({
                            //@ts-ignore
                            company_name: item.company_name,
                            //@ts-ignore
                            logoUri: item.logoUri,
                            //@ts-ignore
                            title: item.title,
                            //@ts-ignore
                            price: item.price,
                            //@ts-ignore
                            description: item.description,
                            active: '',
                            used: '',
                            //@ts-ignore
                            id: item.id,
                              //@ts-ignore
                            expirationDate: item.expirationDate,
                        })}
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
                    {renderBottomSheetContent(bottomSheetContent)}
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D2D2D',
        paddingTop: 70, // Adjusted for status bar height
        paddingHorizontal: 20, // Added horizontal padding
    },
    balanceContainer: {
        // marginBottom: 10, // Added space below the balance section
    },
    balanceText: {
        color: '#FFFFFF',
        fontSize: responsivePixelSize(16), // Adjusted font size
        fontWeight: '700',
        paddingHorizontal: 4,
    },
    circle: {
        backgroundColor: '#424242',
        borderRadius: 10, // Adjusted for circular shape
        padding: 12, // Adjusted padding to make the circle larger
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    pointsText: {
        color: '#FFCC00',
        fontSize: responsivePixelSize(64), // Made the points text larger
        fontWeight: 'bold',
    },
    poengText: {
        color: '#FFFFFF',
        fontSize: responsivePixelSize(14), // Adjusted font size
        fontWeight: 'normal',
        top: -20,
        left: 65,
        marginTop: -15,
    },

    BottomSheetContentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    BottomSheetContent: {
        padding: 20,
    },
    BottomSheetTitleText: {
        color: '#ffffff',
        fontSize: responsivePixelSize(18),
        fontWeight: 'bold',
    },
    BottomSheetBodyText: {
        color: '#ffffff',
        fontSize: responsivePixelSize(16),
    },
    imageStyle: {
        width: responsivePixelSize(50),
        height: responsivePixelSize(59.7),
        marginRight: responsivePixelSize(10),
    },
    separator: {
        alignSelf: 'stretch',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        marginVertical: 10,

    },
    Bottom: {
        top: 10,
        flex: 1,
        alignItems: 'center',
    },

    bottomSheetHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    bottomSheetBody:{
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10,
    },

    bottomSheetFooter:{
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 20,
    }
});

export default Benefits;
