import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; import { createStackNavigator } from '@react-navigation/stack'; import HomeScreen from './app/screens/home.screen';
const Stack = createStackNavigator(); LogBox.ignoreAllLogs(true);
import HomeSceen from "./app/screens/home.screen";
function App() { return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
); }
export default App;