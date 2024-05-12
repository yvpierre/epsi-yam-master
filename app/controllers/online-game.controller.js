// app/controller/online-game.controller.js
import React, { useEffect, useState, useContext } from "react"; import {Button, StyleSheet, Text, View} from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";
import { LinearGradient } from 'expo-linear-gradient';

export default function OnlineGameController() { const socket = useContext(SocketContext);
    const [inQueue, setInQueue] = useState(false); const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);
    useEffect(() => {
        console.log('[emit][queue.join]:', socket.id);
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);
        socket.on('queue.added', (data) => {
            console.log('[listen][queue.added]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });
        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        }); }, []);
        socket.on('queue.eject', (data) => {
            console.log('[listen][queue.leave]');
            setInQueue(data['inQueue'])
            setInGame(data['inGame'])
        })

    const quitQueue = () => {
        socket.emit("queue.leave");
        navigation.navigate('HomeScreen')
    }

    const forfeit = () => {
        socket.emit("queue.ff")
        navigation.navigate('HomeScreen')
    }

    return (
        <LinearGradient colors={['#541765', '#0A002E', '#541765']} style={styles.container}>

            <View style={styles.container}>
                {!inQueue && !inGame && (
                    <>
                        <Text style={styles.paragraph}>
                            En attente d'une connection...
                        </Text>
                    </>
                )}
                {inQueue && (
                    <>
                        <Text style={styles.paragraph}>
                            En attente d'un adversaire...
                        </Text>
                        <Button
                            title="Quitter la file"
                            onPress={() => quitQueue()}
                        />
                    </>
                )}
                {inGame && (
                    <>
                        <Board />
                    </>
                )}
            </View>
        </LinearGradient>
    ); }

const styles = StyleSheet.create({ container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
    paragraph: {
        fontSize: 16,
        color: "#FEF49A",
        fontFamily: 'MarkoOne-Regular',
    }
});