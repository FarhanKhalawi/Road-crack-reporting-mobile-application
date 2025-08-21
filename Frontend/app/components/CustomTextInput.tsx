import React, {useRef} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {responsivePixelSize} from "../../config/responsivePixelSize";


type CustomTextInputProps = {
    title: string;
    placeholder: string;
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad";
    icon: "mail-outline" | "eye-off-outline" | "eye-outline" | "person-outline";
    secureTextEntry?: boolean;

    onChangeText: (text: string) => void;

    error?: boolean;
    errorMessage?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
                                                             title,
                                                             placeholder,
                                                             keyboardType,
                                                             icon,
                                                             secureTextEntry,

                                                             onChangeText,

                                                             error,
                                                             errorMessage,
                                                         }) => {

    const [_icon, _setIcon] = React.useState(icon);
    const [_secureTextEntry, _setSecureTextEntry] = React.useState(secureTextEntry);

    const textInputRef = useRef(null);

    const handleIconPress = () => {
        if (_icon === "eye-off-outline") {
            _setIcon("eye-outline");
            _setSecureTextEntry(false);
        } else if (_icon === "eye-outline") {
            _setIcon("eye-off-outline");
            _setSecureTextEntry(true);
        }
    };

    return (
        // @ts-ignore
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <View style={styles.textInputContainer}>
                    <TouchableOpacity activeOpacity={1} onPress={handleIconPress}>
                        <Ionicons style={styles.icon} name={_icon} size={responsivePixelSize(26)} color="#FFCC00"/>
                    </TouchableOpacity>

                    <TextInput
                        ref={textInputRef}
                        style={styles.textInput}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        autoCapitalize="none"
                        keyboardType={keyboardType}
                        secureTextEntry={_secureTextEntry}
                        clearButtonMode={"while-editing"}
                    />

                </View>
            </View>

            {(error && errorMessage) &&
                <View style={styles.lowerContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flexDirection: 'column',
        width: responsivePixelSize(352),
    },
    upperContainer: {},
    textInputContainer: {
        width: "100%",
        height: responsivePixelSize(52),
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFCC00',

        paddingLeft: responsivePixelSize(8),
    },
    lowerContainer: {
        width: "100%",
    },

    titleText: {
        fontSize: responsivePixelSize(20),
        fontWeight: 'bold',
        marginLeft: responsivePixelSize(14),
        color: '#FFCC00'
    },
    textInput: {
        flex: 1,
        textAlign: 'left',
        fontSize: responsivePixelSize(18),
    },
    icon: {
        marginRight: responsivePixelSize(10),
    },
    errorText: {
        color: '#FE3D2F',
        fontSize: responsivePixelSize(12),
        marginLeft: responsivePixelSize(14),
    },
});
export default CustomTextInput;