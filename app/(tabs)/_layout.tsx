import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const tabBarOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarActiveTintColor: '#000',
    tabBarInactiveTintColor: '#ccc',
  };

  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarLabel: 'Feed',
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: 'Closet',
          tabBarLabel: 'Closet',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    height: 60,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
