import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export function PrimaryAddButton({ title, onPress }) {
    return (
        <Pressable style={styles.btn} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: "#111827",
        marginTop: 12,
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});