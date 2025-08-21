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
            <Stack.Screen name="home" options={{headerShown: false}}/>
            <Stack.Screen name="last_opp" options={{
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
