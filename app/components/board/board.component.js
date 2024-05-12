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
        <Text>Pierre</Text>
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
            <View style={[styles.row, { height: '20%' }]}>
                <OpponentInfos />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimerComponent />
                    <OpponentScore />
                    <OpponentDeck />
                </View>
            </View>
            <View style={[styles.row, { height: '60%' }]}>
                <GridComponent />
            </View>

            <View style={[styles.row, { height: '5%' }]}>
                <PlayerInfos />
                <View style={styles.playerTimerScoreContainer}>
                    <PlayerTimerComponent />
                    <PlayerScore />
                </View>
                <View style={[styles.row, { height: '15%' }]}>
                    <PlayerDeck />
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
        width: '250px',
        height: '100%',
        border: '1px solid red',
        paddingLeft: 10,
        paddingRight: 10,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid orange',
    },
    opponentTimerScoreContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey",
        border: '1px solid red',
    },
    opponentTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid red',
    },
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid red',
    },
    deckOpponentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "white",
    },
    gridContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'red',
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
        borderColor: 'red',
    },
    playerInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey",
        border: '1px solid red',
    },
    playerTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey",
        border: '1px solid red',
    },
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey",
        border: '1px solid red',
    },
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey",
        border: '1px solid red',
    },
});
export default Board;