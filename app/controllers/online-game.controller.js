// app/controller/online-game.controller.js
import React, { useEffect, useState, useContext } from "react"; import {Button, Modal, StyleSheet, Text, View} from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";

export default function OnlineGameController() {
    const { width, height } = useWindowSize()

    const socket = useContext(SocketContext);
    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    const [isOver, setIsOver] = useState(false)
    const [playerMessage, setPlayerMessage] = useState("")
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
        })
    }, []);
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
        <View style={styles.container}>
            {!inQueue && !inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}
            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
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
                    </p>
                    <Button
                        title="Close"
                        onPress={() => setIsOver(false)}
                    />
                </View>
            </Modal>
        </View>
    ); }

const styles = StyleSheet.create({ container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
    paragraph: {
        fontSize: 16,
    }
});