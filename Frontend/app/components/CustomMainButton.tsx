import React from "react";
import {StyleSheet, TouchableOpacity, Text, View} from "react-native";
import {responsivePixelSize} from "../../config/responsivePixelSize";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

type CustomMainButtonProps = {
    title: string;
    onPress?: () => void;
    onInfoPress?: () => void;
    disabled?: boolean;
    iconName: "camera" | "add-photo-alternate" | any;
}

const CustomMainButton: React.FC<CustomMainButtonProps> = ({
                                                               title,
                                                               onPress,
                                                               onInfoPress,
                                                               disabled,
                                                               iconName, // This will be used to render the icon from the Ionicons
                                                           }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}

            style={disabled ? [styles.container, styles.containerDisabled] : styles.container}
        >


            {iconName === "camera" ? (
                <Ionicons style={styles.icon} name={"camera"} size={responsivePixelSize(46)} color="#FFFFFF"/>
            ) : (
                <MaterialIcons style={styles.icon} name="add-photo-alternate" size={46} color="#FFFFFF"/>
            )}


            <View style={styles.contentContainer}>
                <Text
                    style={disabled ? [styles.titleText, styles.titleTextDisabled] : styles.titleText}
                >
                    {title}
                </Text>
            </View>


            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onInfoPress}
                style={styles.info} >
                <Ionicons style={styles.circle} name="help-circle-outline" size={26} color="#FFCC00"/>
            </TouchableOpacity>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: responsivePixelSize(260),
        height: responsivePixelSize(131),
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#767678',
    },
    containerDisabled: {
        // Styles for when the button is disabled (if needed)
        opacity: 0.5, // For example, reduce opacity when the button is disabled
    },
    contentContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    titleText: {
        color: '#fff',
        fontSize: responsivePixelSize(24),
        fontWeight: 'bold',
    },
    titleTextDisabled: {
        color: "#898989",
    },
    icon: {
        marginLeft: 20,
    },
    info: {
        position: 'absolute',
        right: 6,
        top: 6,
    },
    circle: {},
});

export default CustomMainButton;