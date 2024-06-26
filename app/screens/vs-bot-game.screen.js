// app/screens/vs-bot-game.screen.js
import React, { useContext } from "react";
import { StyleSheet, View, Button, Text } from "react-native"; import { SocketContext } from '../contexts/socket.context';
import OnlineGameController from "../controllers/online-game.controller";
import VsbotGameController from "../controllers/vsbot-game.controller";
import { LinearGradient } from 'expo-linear-gradient';

export default function VsBotGameScreen({ navigation }) {
    const socket = useContext(SocketContext);

    const navTo = (path) => {
        navigation.navigate(path)
    }

    return (
        <LinearGradient colors={['#541765', '#0A002E', '#541765']} style={styles.container}>

            <View style={styles.container}>
                {!socket && (
                    <>
                        <Text style={styles.paragraph}>
                            No connection with server...
                        </Text>
                    </>
                )}
                {socket && (
                    <>
                        <VsbotGameController nav={navTo} />
                    </>
            )} </View>
        </LinearGradient>

    ); }
const styles = StyleSheet.create({ container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    } });