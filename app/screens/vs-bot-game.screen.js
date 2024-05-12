// app/screens/vs-bot-game.screen.js
import React, { useContext } from "react";
import { StyleSheet, View, Button, Text } from "react-native"; import { SocketContext } from '../contexts/socket.context';
import OnlineGameController from "../controllers/online-game.controller";
import VsbotGameController from "../controllers/vsbot-game.controller";
export default function VsBotGameScreen({ navigation }) {
    const socket = useContext(SocketContext);

    const navTo = (path) => {
        navigation.navigate(path)
    }

    return (
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
    ); }
const styles = StyleSheet.create({ container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    } });