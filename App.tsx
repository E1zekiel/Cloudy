import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { DrawScreen } from "./src/screens/DrawScreen";
import ConnectScreen from "./src/screens/connectScreen/ConnectScreen";
import Header from "./src/header/header";
import Svg, { Rect } from "react-native-svg";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AnimationScreen } from "./src/screens/AnimationScreen";
import { BlColors } from "./src/colors/colors";
const BottomTapNav = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const navigationRef = createNavigationContainerRef()

export default function App() {
 return(
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" component={BottomTabNavigator} options={{headerShown:false}} navigationKey="3"/>
      <Stack.Screen name="ConnectScreen" component={ConnectScreen} options={{headerShown:false, presentation:'modal'}}/>
    </Stack.Navigator>
  </NavigationContainer>
 )
}

const BottomTabNavigator = () => {
  return (
    <BottomTapNav.Navigator >
    <BottomTapNav.Group screenOptions={{
    header: (p) => (<Header props={p}/>),
    tabBarStyle:{
      height:70,
      borderTopColor:'#242424', 
      backgroundColor:'#242424',
      position:'absolute',
      borderRadius:20,
      marginBottom:20,
      width:'90%',
      marginLeft:'5%'
    },
    tabBarActiveTintColor:BlColors.Primary,
    tabBarIcon:(p) => (
      <Svg fill={p.color} width={25} height={25}>
        <Rect  width={'100%'} height={'100%'} rx='5' ry='5' />
      </Svg>
    )
  }}>
      <BottomTapNav.Screen name="Рисование" component={DrawScreen} />
      <BottomTapNav.Screen name="Screenthree" component={AnimationScreen} />
    </BottomTapNav.Group>
  </BottomTapNav.Navigator>
  )
}