import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function AddExpenseScreen({ onSave, onCancel }) {
    const [amount, setAmount] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const normalizedAmount = Number(String(amount).replace(",", "."));
        if (!Number.isFinite(normalizedAmount)) {
            return;
        }

        setIsSaving(true);
        const entry = {
            id: Date.now().toString(),
            amount: normalizedAmount,
            date: new Date().toISOString(),
        };

        try {
            const stored = await AsyncStorage.getItem("expenses");
            const existing = stored ? JSON.parse(stored) : [];
            const next = [entry, ...existing];
            await AsyncStorage.setItem("expenses", JSON.stringify(next));
            onSave(entry);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tilfoej udgift</Text>

            <View style={styles.fieldBlock}>
                <Text style={styles.label}>Beloeb</Text>
                <TextInput
                    keyboardType="decimal-pad"
                    placeholder="0"
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.footer}>
                <Pressable
                    accessibilityRole="button"
                    onPress={handleSave}
                    style={[styles.button, styles.primaryButton]}
                    disabled={isSaving}
                >
                    <Text style={styles.primaryButtonText}>Tilfoej udgift</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    onPress={onCancel}
                    style={[styles.button, styles.secondaryButton]}
                >
                    <Text style={styles.secondaryButtonText}>Tilbage</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    fieldBlock: {
        marginTop: 24,
    },
    label: {
        fontSize: 12,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    footer: {
        marginTop: 24,
        gap: 12,
    },
    button: {
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    primaryButton: {
        backgroundColor: "#2F70FF",
        borderColor: "#2F70FF",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    secondaryButton: {
        borderColor: "#2F70FF",
    },
    secondaryButtonText: {
        color: "#2F70FF",
        fontSize: 14,
        fontWeight: "700",
    },
});
