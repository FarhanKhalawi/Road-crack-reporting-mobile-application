import React from "react";
import {ActivityIndicator, StyleSheet, TouchableOpacity, Text} from "react-native";
import {responsivePixelSize} from "../../config/responsivePixelSize";


type CustomButtonProps = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}
const CustomButton: React.FC<CustomButtonProps> = ({
                                                       title,
                                                       onPress,
                                                       disabled,
                                                       isLoading,
                                                   }) => {

    return (
        <TouchableOpacity activeOpacity={0.8}
                          onPress={onPress}
                          disabled={disabled || isLoading}
                          style={disabled ? [styles.container, styles.containerDisabled] : [styles.container]}>
            {isLoading ? (
                <ActivityIndicator size={"large"} color={"#FFCC00"}/>
            ) : (
                <Text
                    style={disabled ? [styles.titleText, styles.titleTextDisabled] : [styles.titleText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({
    container: {
        width: responsivePixelSize(260),
        height: responsivePixelSize(46),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#767678',
    },

    containerDisabled: {},

    titleText: {
        color: '#fff',
        fontSize: responsivePixelSize(24),
        fontWeight: 'bold',
    },

    titleTextDisabled: {
        color: "#898989",
    }
});


export default CustomButton;