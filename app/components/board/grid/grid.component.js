import React, { useEffect, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Grid = () => {
    const socket = useContext(SocketContext);

    const [displayGrid, setDisplayGrid] = useState(true);
    const [canSelectCells, setCanSelectCells] = useState([]);
    const [grid, setGrid] = useState([]);

    const handleSelectCell = (cellId, rowIndex, cellIndex) => {
        if (canSelectCells) {
            socket.emit("game.grid.selected", { cellId, rowIndex, cellIndex });
        }
    };

    useEffect(() => {
        socket.on("game.grid.view-state", (data) => {
            setDisplayGrid(data['displayGrid']);
            setCanSelectCells(data['canSelectCells']);
            setGrid(data['grid']);
        });
    }, []);

    // Function to determine cell background color
    const getCellBackgroundColor = (rowIndex, cellIndex) => {
        // Alternate colors based on row and column index
        return (rowIndex + cellIndex) % 2 === 0 ? "#FFFFFF" : "#CCCCCC"; // You can change these colors as per your preference
    };

    return (
        <View style={styles.gridContainer}>
            {displayGrid &&
                grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <TouchableOpacity
                                key={cell.id}
                                style={[
                                    styles.cell,
                                    { backgroundColor: getCellBackgroundColor(rowIndex, cellIndex) },
                                    cell.owner === "player:1" && styles.playerOwnedCell,
                                    cell.owner === "player:2" && styles.opponentOwnedCell,
                                    cell.canBeChecked && !(cell.owner === "player:1") && !(cell.owner === "player:2") && styles.canBeCheckedCell,
                                    rowIndex !== 0 && styles.topBorder,
                                    cellIndex !== 0 && styles.leftBorder,
                                ]}
                                onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                                disabled={!cell.canBeChecked}
                            >
                                <Text style={styles.cellText}>{cell.viewContent}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 7,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    row: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    cell: {
        flexDirection: "row",
        flex: 2,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#541765",
    },
    cellText: {
        fontSize: 11,
    },
    playerOwnedCell: {
        backgroundColor: "lightgreen",
        opacity: 0.9,
    },
    opponentOwnedCell: {
        backgroundColor: "lightcoral",
        opacity: 0.9,
    },
    canBeCheckedCell: {
        backgroundColor: "lightyellow",
    },
    topBorder: {
        borderTopWidth: 1,
    },
    leftBorder: {
        borderLeftWidth: 1,
    },
});

export default Grid;
