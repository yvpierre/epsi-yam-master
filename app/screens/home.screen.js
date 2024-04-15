import { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
export default function HomeScreen() {
    const socket = useContext(SocketContext);
    const [time, setTime] = useState(null);

    useEffect(() => {
        socket.on("time-msg", (data) => { setTime(new Date(data.time).toString());});
        return () => {
            socket.disconnect();
            socket.removeAllListeners();
        };
    }, []);

    return (
        <View style={styles.container}>
            {!socket ? (
                <>
                    <Text style={styles.paragraph}>
                        Connecting to websocket server...
                    </Text>
                    <Text style={styles.footnote}>
                        Make sure the backend is started and reachable
                    </Text> </>
            ):
            socket && (
                <>
                    <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
                        Server time
                    </Text>
                    <Text style={styles.paragraph}>{time}</Text>
                </>
            )} </View>
    ); }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    paragraph: {
        fontSize: 16,
    },
    footnote: {
        fontSize: 14,
        fontStyle: "italic",
    },
});