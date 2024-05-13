import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';



export default function HomeScreen({ navigation }) {
    React.useEffect(() => {
        // Load the font asynchronously

    }, []);

    return (
        <LinearGradient colors={['#541765', '#0A002E', '#541765']} style={styles.container}>
            <Image
                source={require("../assets/yam master.png")}
                style={styles.image}
            />
            <Text style={styles.titleText}> 
                DELUXE EDITION
            </Text>
            <View style={styles.content}>
                <CustomButton
                    title="JOUER"
                    onPress={() => navigation.navigate("MenuGameScreen")}
                    textColor="#FEF49A"
                    gradientColors={['#C9083F', '#FF5BB3', '#C9083F']}
                />
                <div style={styles.btnwip}>
                    <CustomButton
                        title="OPTIONS"
                        textColor="#FEF49A"
                        gradientColors={['#C9083F', '#FF5BB3', '#C9083F']}
                    />
                </div>
                <div style={styles.btnwip}>
                    <CustomButton
                        title="AIDE"
                        textColor="#FEF49A"
                        class="btnwip"
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

const styles = StyleSheet.create(
    {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        color: "white"
    },
    image: {
        width: "287px",
        height: null,
        resizeMode: "cover",
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
        overflow: 'hidden', 
        borderWidth: 5,
        borderColor: '#FEF49A' 
    },
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "MarkoOne-Regular", 

    },
    titleText: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        fontWeight: 400,
        marginVertical: 10,
        fontFamily: "MarkoOne-Regular", 
    },
    btnwip: {
        opacity: 0.5,
    }
});
