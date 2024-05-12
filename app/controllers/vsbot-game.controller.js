// app/controller/online-game.controller.js
import React, { useEffect, useState, useContext } from "react"; import {Button, Modal, StyleSheet, Text, View} from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";

export default function VsbotGameController({ nav }) {
    const { width, height } = useWindowSize()

    const socket = useContext(SocketContext);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    const [isOver, setIsOver] = useState(false)
    const [playerMessage, setPlayerMessage] = useState("")
    const [gameDetails, setGameDetails] = useState("")
    const [opponentMessage, setOpponentMessage] = useState("")
    const [playerWin, setPlayerWin] = useState(false)

    useEffect(() => {
        setInGame(true);
        socket.emit("game.vsbot.start")
        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
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
    }, []);

    const toMenu = () => {
        nav({ name: 'HomeScreen' });
        setIsOver(false);
    }

    return (
        <View style={styles.container}>
            {!inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
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
    ); }

const styles = StyleSheet.create({
    container: {
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