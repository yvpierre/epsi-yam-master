import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/home.screen';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

import {SocketContext, socket} from "./app/contexts/socket.context";
import OnlineGameScreen from "./app/screens/online-game.screen";
import VsBotGameScreen from "./app/screens/vs-bot-game.screen";
import MenuGameScreen from "./app/screens/menu-game.screen";
import MenuDifficultyScreen from "./app/screens/menu-difficulty.screen";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="OnlineGameScreen" 
            component={OnlineGameScreen} 
            options={{ 
              title: 'EN MATCH', 
              headerTitleStyle: { fontFamily: 'MarkoOne-Regular', letterSpacing: 4, fontWeight: 'bold', fontSize: 24},
              headerBackground: () => (
                <LinearGradient
                  colors={['#95640F', '#FEFDC9', '#95640F']}
                  style={{ flex: 1 }}
                />
              ),
            }} 
          />
          <Stack.Screen 
            name="VsBotGameScreen" 
            component={VsBotGameScreen} 
            options={{ 
              headerBackground: () => (
                <LinearGradient
                colors={['#95640F', '#FEFDC9', '#95640F']}
                style={{ flex: 1 }}
                />
              ),
            }} 
          />
          <Stack.Screen 
            name="MenuGameScreen" 
            component={MenuGameScreen} 
            options={{ 
              title: 'JOUER', 
              headerTitleStyle: { fontFamily: 'MarkoOne-Regular', letterSpacing: 4, fontWeight: 'bold' }, 
              headerBackground: () => (
                <LinearGradient
                colors={['#95640F', '#FEFDC9', '#95640F']}
                style={{ flex: 1 }}
                />
              ),
            }} 
          />
          <Stack.Screen 
            name="MenuDifficultyScreen" 
            component={MenuDifficultyScreen} 
            options={{ 
              title: 'DIFFICULTÉ', 
              headerTitleStyle: { fontFamily: 'MarkoOne-Regular', letterSpacing: 4, fontWeight: 'bold' }, 
              headerBackground: () => (
                <LinearGradient
                colors={['#95640F', '#FEFDC9', '#95640F']}
                style={{ flex: 1 }}
                />
              ),
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;