// app/controller/online-game.controller.js
import React, { useEffect, useState, useContext } from "react";
import {Button, Modal, StyleSheet, Text, View} from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";

import { LinearGradient } from 'expo-linear-gradient';

export default function OnlineGameController() {
    const socket = useContext(SocketContext);
    const { width, height } = useWindowSize()

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    const [isOver, setIsOver] = useState(false)
    const [playerMessage, setPlayerMessage] = useState("")
    const [gameDetails, setGameDetails] = useState("")
    const [opponentMessage, setOpponentMessage] = useState("")
    const [playerWin, setPlayerWin] = useState(false)

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
        });
        socket.on('game.end', (data) => {
            console.log("fin de game")
            setIsOver(data['isOver']);
            setPlayerMessage(data['playerMessage'])
            setPlayerWin(data['playerWin'])
            setGameDetails(data['gameDetails'])
        })
        socket.on('queue.eject', (data) => {
            console.log('[listen][queue.leave]');
            setInQueue(data['inQueue'])
            setInGame(data['inGame'])
        })
    }, []);

    const toMenu = () => {
        nav({ name: 'HomeScreen' });
        setIsOver(false);
    }
    const quitQueue = () => {
        socket.emit("queue.leave");
        toMenu()
    }

    const forfeit = () => {
        socket.emit("queue.ff");
        nav({ name: 'HomeScreen' });
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
                {isOver && playerWin && (
                    <>
                        <View>
                            <Confetti
                                width={width}
                                height={height}
                            />
                        </View>
                    </>

                )}
                <Modal
                    visible={isOver}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <p>
                            {playerMessage}
                            {gameDetails}
                        </p>
                        <Button
                            title="Rejouer"
                            onPress={() => setIsOver(false)}
                        />
                        <Button
                            title="Retour au menu"
                            onPress={() => toMenu()}
                        />
                    </View>
                </Modal>
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