import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';


import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ScanScreen from './src/screens/ScanScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Stack = createNativeStackNavigator();
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

console.log("--- CHECKING SCREENS ---");
console.log("Dashboard:", !!DashboardScreen);
console.log("Inventory:", !!InventoryScreen);
console.log("Scan:", !!ScanScreen);
console.log("Alerts:", !!AlertsScreen);
console.log("Profile:", !!ProfileScreen);
console.log("------------------------");

function MainApp() {
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        <Stack.Screen name="Reports" component={ReportsScreen} options={{ headerShown: true, title: "Reports" }} />

        <Stack.Screen name="MainApp" component={MainApp} />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ headerShown: true, title: 'Details', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ headerShown: true, title: 'Add Product', headerBackTitleVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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