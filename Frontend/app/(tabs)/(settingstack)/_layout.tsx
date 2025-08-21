import React from 'react';
import {Stack, } from 'expo-router';

const headerOptions = {
    headerStyle: {
        backgroundColor: '#999999', // Your desired color for the header background
    },
    headerTintColor: '#000000', // Your desired color for the header icons and title
    headerBackTitleVisible: false,
};

const NewLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="settings" options={{headerShown: false}}/>
            <Stack.Screen name="change_password" options={{
                title: '',
                headerBackTitleVisible: false,
                headerStyle: {backgroundColor: "#2D2D2D"},
                headerShadowVisible: false,
                headerTintColor: '#FFCC00',
            }}/>
            <Stack.Screen name="feedback" options={{
                title: '',
                headerBackTitleVisible: false,
                headerStyle: {backgroundColor: "#2D2D2D"},
                headerShadowVisible: false,
                headerTintColor: '#FFCC00',
            }}/>
            
        </Stack>
        
    
    );
};

export default NewLayout;
