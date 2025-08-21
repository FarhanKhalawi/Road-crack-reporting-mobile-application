import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { responsivePixelSize } from "../../config/responsivePixelSize";
import CustomLog from '../components/CustomLog';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useNavigation } from "expo-router";
import { getFirestore, collection, getDocs, query, where } from '@firebase/firestore';
import auth from '../Firebase/config';
import { getAuth } from 'firebase/auth';

const History = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['74%'], []);
    const [bottomSheetContent, setBottomSheetContent] = useState<any>({});
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchReports = async () => {
        setIsRefreshing(true);
        try {
            const db = getFirestore();
            const uid = auth.currentUser?.uid;
            console.log(uid);
            const reportsCollection = collection(db, 'reports');
            //@ts-ignore
            const reportsQuery = query(reportsCollection, where('userId', '==', uid));
            const querySnapshot = await getDocs(reportsQuery);
            const fetchedReports = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(fetchedReports);
        
            //@ts-ignore
            setReports(fetchedReports);
            setIsRefreshing(false);
            setIsLoading(false); // Oppdater isLoading til false etter vellykket henting av data
        } catch (error) {
            console.error('Error fetching reports:', error);
            setIsLoading(false); // Hvis det oppstår en feil, oppdater isLoading til false også
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);


    type BottomSheetContentProps = {
        status: string;
        imageUrl: any;
        area: string;
        sendDate: any;
        latitude: string;
        longitude: string;
    }

    const handleOpenModalPress = useCallback((item: BottomSheetContentProps) => {
        const imageUrl = item.imageUrl || '';
        setBottomSheetContent({ ...item, imageUrl });
        setBottomSheetContent(item);
    }, []);

    useEffect(()=> {
        if(bottomSheetContent){
            bottomSheetRef.current?.expand();
        }
    }, [bottomSheetContent])

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

    const renderBottomSheetContent: React.FC<BottomSheetContentProps> = ({
        imageUrl,
        status,
        area,
        sendDate,
        latitude,
        longitude
    }) => {
        console.log(bottomSheetContent);
        return (
            <View style={styles.BottomSheetContent}>
                <View style={styles.bottomSheetHeader}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
                ) : (
                    <View style={[styles.imageStyle, styles.placeholderImage]}>
                        <Text>No Image Available</Text>
                    </View>
                )}
                </View>
                <View style={styles.bottomSheetBody}>
                    <Text style={styles.textLabel}>Status: <Text style={styles.BottomSheetBodyText}>{bottomSheetContent.status}</Text></Text>
                    <Text style={styles.textLabel}>Område: <Text style={styles.BottomSheetBodyText}>{bottomSheetContent.area}</Text></Text>
                    <Text style={styles.textLabel}>Breddegrad: <Text style={styles.BottomSheetBodyText}>{bottomSheetContent.latitude}</Text></Text>
                    <Text style={styles.textLabel}>Lengdegrad: <Text style={styles.BottomSheetBodyText}>{bottomSheetContent.longitude}</Text></Text>
                    <Text style={styles.textLabel}>Sendt: <Text style={styles.BottomSheetBodyText}>{bottomSheetContent.sendDate}</Text></Text>
                </View>
            </View>
        );
    };

    // Function to convert timestamp
    const convertTimestamp = (timestampObj: { seconds: number; }) => {
        console.log(timestampObj);
        // Assume timestampObj is an object like Firebase Timestamp
        const date = new Date(timestampObj.seconds * 1000);
        return formatDate(date);
    };

    // Function to format a Date object to "dd.mm.yyyy"
    function formatDate(date: Date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.historyText}>Historikk</Text>
            <FlatList
                data={reports}
                //@ts-ignore
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
                onRefresh={fetchReports}
                renderItem={({ item }) => (
                    <CustomLog
                        //@ts-ignore
                        status={"under behandling"}
                        //@ts-ignore
                        area={"utilgjengelig"}
                        //@ts-ignore
                        image={item.imageUrl}
                        //@ts-ignore
                        sendDate={convertTimestamp(item.timestamp)}
                        //@ts-ignore
                        latitude={item.latitude}
                        //@ts-ignore
                        longitude={item.longitude}

                        onPress={() => handleOpenModalPress({
                            //@ts-ignore
                            status: "under behandling",
                            //@ts-ignore
                            imageUrl: item.imageUrl,
                            //@ts-ignore
                            area: "-",
                            //@ts-ignore
                            sendDate: convertTimestamp(item.timestamp),
                            //@ts-ignore
                            latitude: item.metadata.latitude,
                            //@ts-ignore
                            longitude: item.metadata.longitude
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
                style={{ marginHorizontal: 20 }}
                backgroundStyle={{ backgroundColor: "rgb(72,72,72)" }}
                handleIndicatorStyle={{ backgroundColor: "rgb(137,137,137)" }}
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
    historyText: {
        color: '#FFFFFF',
        fontSize: responsivePixelSize(20), // Adjusted font size
        fontWeight: '700',
        paddingHorizontal: 4,
    },
    placeholderImage: {
        backgroundColor: '#cccccc', // Placeholder color
        justifyContent: 'center',
        alignItems: 'center',
    },
    BottomSheetContentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    BottomSheetContent: {},
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    bottomSheetBody: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 7
    },
    BottomSheetBodyText: {
        color: '#ffffff',
        fontSize: responsivePixelSize(16),
        fontWeight: 'normal',
    },
    imageStyle: {
        width: responsivePixelSize(310),
        height: responsivePixelSize(310),
        borderRadius: 10,
    },
    textLabel: {
        color: '#FFF',
        fontSize: responsivePixelSize(16),
        fontWeight: 'bold',
    },
});

export default History;
