import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {SocketContext} from "../../../contexts/socket.context";

const PlayerTimerComponent = () => {
    const socket = useContext(SocketContext);
    const [playerTimer, setPlayerTimer] = useState(0);
    useEffect(() => {
        socket.on("game.timer", (data) => {
            setPlayerTimer(data['playerTimer'])
        });
    }, []);
    return (
        <View style={styles.playerTimerContainer}>
            <Text>Timer: {playerTimer}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
});

export default PlayerTimerComponent;