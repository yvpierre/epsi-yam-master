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
    <View >
        <Text style={{ color: 'white' }}>Pierre</Text>
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
            <Text style={{ color: 'white' }}>Score : {opponentScore}</Text>
        </View>
    );
};
const PlayerInfos = () => {
    return (
    <View >
        <Text style={{ color: 'white' }}>Player Infos</Text>
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
            <Text style={{ color: 'white' }}>Score : {playerScore}</Text>
        </View>
    );
};
const Board = ({ gameViewState}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <View style={styles.opponentInfosContainer}>
                    <OpponentInfos />
                    <OpponentTimerComponent />
                    <OpponentScore />
                </View>
            </View>
            <View style={[styles.row, { height: '15%' }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, { height: '60%' }]}>
                <GridComponent />
            </View>

            <View style={[styles.row, { height: '5%' }]}>
                <View style={styles.playerInfosContainer}>
                    <PlayerInfos />
                    <PlayerTimerComponent />
                    <PlayerScore />
                </View>
            </View>
            <View style={[styles.row, { height: '15%' }]}>
                <PlayerDeck />
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
        width: '297px',
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    opponentInfosContainer: {
        flex: 7,
        flexDirection: 'row',
        width: '281px',
    },
    opponentTimerScoreContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    playerInfosContainer: {
        flex: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '281px',
    },
    playerTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Board;