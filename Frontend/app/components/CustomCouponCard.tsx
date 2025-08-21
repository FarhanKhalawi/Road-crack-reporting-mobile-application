import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import {responsivePixelSize} from '../../config/responsivePixelSize';
import {FontAwesome} from '@expo/vector-icons';

type CustomCouponCardProps = {
    title: string;
    expirationDate: string;
    onPress?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    price?: string;
    image?: string;
    type: "active" | "price";
}

const CustomCouponCard: React.FC<CustomCouponCardProps> = ({
                                                               title,
                                                               expirationDate,
                                                               onPress,
                                                               disabled,
                                                               isLoading,
                                                               price,
                                                               image,
                                                               type,
                                                           }) => {

                                                           
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[styles.container, disabled && styles.disabledContainer]}
        >
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFCC00" style={styles.loadingIndicator}/>
            ) : (
                <>
                    <View style={styles.upperContainer}>
                        <View style={styles.priceContainer}>
                            {type === "active" ? (
                                <Text style={[styles.numberText, {paddingHorizontal: 6}]}>Aktiv</Text>
                            ) : (
                                <>
                                    <FontAwesome name="star" size={responsivePixelSize(16)} color="#FFCC00"/>
                                    <Text style={styles.numberText}>{price}</Text>
                                </>
                            )}
                        </View>
                    </View>

                    <View style={styles.bodyContainer}>
                        <View>
                            {/*@ts-ignore*/}
                            {image && <Image source={{uri: image}} style={styles.image} resizeMode='contain'/>}
                        </View>
                        <View>
                            <Text style={[styles.titleText, disabled && styles.textDisabled]}>
                                {title}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.lowerContainer}>
                        <Text style={[styles.expirationText, disabled && styles.textDisabled]}>Gyldig
                            til {expirationDate}</Text>
                    </View>

                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#424242',
        borderRadius: 10,
        marginBottom: 10,
    },

    upperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },

    priceContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 10, //fix this 
        gap: 4,
    },


    bodyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 10,
        gap: 10,
    },

    lowerContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    disabledContainer: {
        opacity: 0.5,
    },

    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleText: {
        color: '#fff',
        fontSize: responsivePixelSize(20),
        fontWeight: 'bold',
    },

    expirationText: {
        color: '#fff',
        fontSize: responsivePixelSize(10),
    },

    textDisabled: {
        color: '#898989',
    },

    numberText: {
        color: '#FFCC00',
        fontSize: responsivePixelSize(14),
        fontWeight: 'bold',
    },

    image: {
        width: responsivePixelSize(50),
        height: responsivePixelSize(59.7),
        // marginRight: responsivePixelSize(10),
    },

});

export default CustomCouponCard;
