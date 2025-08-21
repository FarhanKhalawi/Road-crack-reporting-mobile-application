import React from 'react';
import {FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

export default function TabLayout() {

  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFCC00',
        tabBarStyle: {
          backgroundColor: '#2D2D2D', // Set the background color here
        },
      }}
    >
      <Tabs.Screen
        name="(homestack)"
        options={{
          title: 'Hjem',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: 'Fordeler',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo size={28} name="star-outlined" color={color} />,
          
          
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historikk',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
          
          
        }}
      />
      <Tabs.Screen
        name="(settingstack)"
        options={{
          title: 'Innstillinger',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="settings-outline" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="camera"
        options={{
          title: '',
          tabBarStyle: { display: 'none' }, // This will hide the tab bar for this tab
          href: null,
          headerShown: false
        }}
      />

      <Tabs.Screen
        name="usecoupon"
        options={{
          title: '',
          tabBarStyle: { display: 'none' }, // This will hide the tab bar for this tab
          href: null,
          headerShown: false
        }}
      />
    </Tabs>
  );
}
