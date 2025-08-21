import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { responsivePixelSize } from '../../config/responsivePixelSize';

type CustomLogProps = {
    onPress?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    image?: string;
    status: string;
    sendDate: string;
    area: string;
    latitude: string;
    longitude: string;

}

const CustomLog: React.FC<CustomLogProps> = ({
    onPress,
    disabled,
    isLoading,
    image, 
    status, 
    sendDate,
    area,
    

}) => {

    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[styles.container, disabled && styles.disabledContainer]}
        >
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFCC00" style={styles.loadingIndicator} />
            ) : (
                <>
                
                <View style={styles.contentContainer}>
                    {/*@ts-ignore*/}
                    {image && <Image source={{uri: image}} style={styles.image} />}

                </View>

                <View style={styles.infoRootContainer}>
                    <View style={styles.infoContainer}>
                    <Text style={styles.textLabel}>
                        Status: <Text style={styles.text}>{status}</Text>
                    </Text>

                    <Text style={styles.textLabel}>
                          Sendt: <Text style={styles.text}>{ sendDate}</Text>
                        </Text>
                    </View>

                    <View style={styles.infoContainer2} >
                    <Text style={styles.textLabel}>
                        Område: <Text style={styles.text}>{area}</Text>
                    </Text>
                    </View>
                    
                </View>

                </>
            )}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#424242',
        borderRadius: 10,
        padding: responsivePixelSize(10),
        alignItems: 'center',
        marginBottom: 10, 
        borderWidth: 1,
        borderColor: '#FFCC00',
        height: 70
    },
    disabledContainer: {
        opacity: 0.5,
    },

    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    image: { 
        width: responsivePixelSize(50),
        height: responsivePixelSize(50),
        marginRight: responsivePixelSize(10),
    },
    infoRootContainer:{ 
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',

    },

    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       
    },
    infoContainer2: {
       // flex: 0.65,
        //marginBottom: 33,
    },
    text: {
        color: '#FFF',
        fontSize: responsivePixelSize(12),
        fontWeight: 'normal',
        
    },
    textLabel: {
        color: '#FFF',
        fontSize: responsivePixelSize(12),
        fontWeight: 'bold',
    },
    
});

export default CustomLog;