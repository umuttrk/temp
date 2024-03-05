import React from "react";
import Homepage from "../screens/Homepage";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateProduct from "../screens/CreateProduct";
import Browse from "../screens/Browse";
import ProductDetailScreen from "../screens/ProductDetails";
import  SettingsScreen from "../screens/SettingsScreen";
import  MyOffers from "../screens/MyOffers";
import  Chatting from "../screens/Chatting";
import  Messages from "../screens/Messages";
const Stack = createNativeStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="Homepage" component={Homepage}      options={{ headerShown: false }} // Hide the header for the Home screen
 />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />   
      <Stack.Screen name="AddProduct" component={CreateProduct} /> 
      <Stack.Screen name="Browse" component={Browse}/> 
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} /> 
      <Stack.Screen name="Settings" component={SettingsScreen} /> 
      <Stack.Screen name="MyOffers" component={MyOffers} /> 
      <Stack.Screen name="Chatting" component={Chatting} options={{ headerShown: true }} /> 
      <Stack.Screen name="Messages" component={Messages} options={{ headerShown: true }} /> 
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNav;
