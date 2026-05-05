import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ScanScreen from '../screens/ScanScreen';

const Tab = createBottomTabNavigator();

const CustomScanButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonWrapper}
    onPress={onPress}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2563EB', 
        tabBarInactiveTintColor: '#9CA3AF', 
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
        }}
      />

      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: () => <Feather name="camera" size={28} color="#fff" />,
          tabBarLabel: () => null,
          tabBarButton: (props) => <CustomScanButton {...props} />
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS === 'ios' ? 90 : 70, 
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  customButtonWrapper: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  customButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#1E3A8A', 
    justifyContent: 'center',
    alignItems: 'center',
  }
});