import React from 'react'
import {Stack} from 'expo-router';
import {GestureHandlerRootView} from "react-native-gesture-handler";

const headerOptions = {
    headerStyle: {
        backgroundColor: '#2D2D2D', // Your desired color for the header background
    },
    headerShadowVisible: false,
    headerTintColor: '#FFCC00'
};


const StackLayout = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="signup" options={{title: '', headerBackTitleVisible: false, ...headerOptions}}/>
                <Stack.Screen name="privacypolicy"
                              options={{title: '', headerBackTitleVisible: false, ...headerOptions}}/>
                <Stack.Screen name="forget_password"
                              options={{title: '', headerBackTitleVisible: false, ...headerOptions}}/>
            </Stack>
        </GestureHandlerRootView>
    );
};

export default StackLayout;