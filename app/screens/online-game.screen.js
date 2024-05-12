// app/screens/online-game.screen.js
import React, { useContext } from "react";
import { StyleSheet, View, Button, Text } from "react-native"; import { SocketContext } from '../contexts/socket.context';
import OnlineGameController from "../controllers/online-game.controller";
import { LinearGradient } from 'expo-linear-gradient';
export default function OnlineGameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    return (
        <LinearGradient colors={['#541765', '#0A002E', '#541765']} style={styles.container}>

            <View style={styles.container}>
                {!socket && (
                    <>
                        <Text style={styles.paragraph}>
                            No connection with server...
                        </Text>
                        <Text style={styles.footnote}>
                            Restart the app and wait for the server to be back again.
                        </Text> </>
                )}
                {socket && (
                    <>
                        <OnlineGameController />
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