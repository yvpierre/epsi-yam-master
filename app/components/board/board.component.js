// app/components/board/board.component.js
import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, PlatformColor} from 'react-native';
import OpponentTimerComponent from "./timers/opponent-timer.component";
import PlayerTimerComponent from "./timers/player-timer.component";
import PlayerDeckComponent from "./player-deck/player-deck.component";
import PlayerDeck from "./player-deck/player-deck.component";
import OpponentDeck from "./opponent-deck/opponent-deck.component";
import GridComponent from "./grid/grid.component";
import ChoicesComponent from "./choices/choices.component";
import {socket, SocketContext} from "../../contexts/socket.context";
const OpponentInfos = () => {
    return (
    <View style={styles.opponentInfosContainer}>
        <Text>Opponent infos</Text>
    </View>
);
};

const OpponentScore = () => {
    const socket = useContext(SocketContext);
    const [opponentScore, setOpponentScore] = useState(0);

    useEffect(() => {
        socket.on("game.score.view-state", (data) => {
            setOpponentScore(data['opponentScore'])
        })
    }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text>Score : {opponentScore}</Text>
        </View>
    );
};
const PlayerInfos = () => {
    return (
    <View style={styles.playerInfosContainer}>
        <Text>Player Infos</Text>
    </View>
);
};
const PlayerScore = () => {
    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);

    useEffect(() => {
        socket.on("game.score.view-state", (data) => {
            setPlayerScore(data['playerScore'])
        })
    }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text>Score : {playerScore}</Text>
        </View>
    );
};
const Board = ({ gameViewState}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <OpponentInfos />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimerComponent />
                    <OpponentScore />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, { height: '40%' }]}>
                <GridComponent />
                <ChoicesComponent />
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <PlayerDeck />
            </View>

            <View style={[styles.row, { height: '5%' }]}>
                <PlayerInfos />
                <View style={styles.playerTimerScoreContainer}>
                    <PlayerTimerComponent />
                    <PlayerScore />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }, row: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey"
    },
    opponentTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
    opponentTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deckOpponentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black"
    },
    gridContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
    },
    choicesContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deckPlayerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
            borderColor: 'black',
        },
        playerInfosContainer: {
            flex: 7,
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderColor: 'black',
                backgroundColor: "lightgrey"
        },
        playerTimerScoreContainer: {
            flex: 3,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "lightgrey"
        },
        playerTimerContainer: {
            flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "lightgrey"
        },
        playerScoreContainer: {
            flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "lightgrey"
        },
});
export default Board;