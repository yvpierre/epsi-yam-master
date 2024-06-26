import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuGameScreen({ navigation }) {
    return (
        <LinearGradient colors={['#541765', '#0A002E', '#541765']} style={styles.container}>
            <View style={styles.content}>
                <CustomButton
                    title="SOLO"
                    onPress={() => navigation.navigate("MenuDifficultyScreen")}
                    textColor="#FEF49A"
                    gradientColors={['#C9083F', '#FF5BB3', '#C9083F']}
                />
                <CustomButton
                    title="MULTI"
                    onPress={() => navigation.navigate("OnlineGameScreen")}
                    textColor="#FEF49A"
                    gradientColors={['#C9083F', '#FF5BB3', '#C9083F']}
                />
                <div style={styles.btnwip}>
                    <CustomButton
                        title="REPLAY"
                        onPress={() => navigation.navigate("ReplayScreen")}
                        textColor="#FEF49A"
                        gradientColors={['#C9083F', '#FF5BB3', '#C9083F']}
                    />
                </div>
            </View>
        </LinearGradient>
);
}

const CustomButton = ({ title, onPress, textColor, gradientColors }) => (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <LinearGradient
            colors={gradientColors}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        color: "white"
    },
    content: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 400,

    },
    buttonContainer: {
        width: 200,
        height: 53,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden', // to clip the gradient within the button container
        border: '5px solid #FEF49A'
    },
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "MarkoOne-Regular", // Use the declared font family here
    },
    btnwip: {
        opacity: 0.5,
    }
});
