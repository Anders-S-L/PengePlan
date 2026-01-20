import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../components/UI/AppText";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import { Card } from "../components/UI/Card";
import { Switch } from "react-native";
import { theme } from "../styles/theme";

const categories = [
    "Mad",
    "Transport",
    "Hjem",
    "Shopping",
    "Underholdning",
    "Andet",
];

export function AddVariableExpenseModal({ visible, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [isLuxury, setIsLuxury] = useState(false);
    const [category, setCategory] = useState(categories[0]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    async function handleAdd() {
        if (!name || !amount) return;

        await onSubmit({
            name,
            amount: parseFloat(amount),
            category,
            isLuxury,
            createdAt: Date.now(),
        });

        setName("");
        setAmount("");
        onClose();

    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Card style={styles.modalCard}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerText}>
                            <AppText variant="h4" style={styles.title}>
                                Tilføj ny udgift
                            </AppText>
                            <AppText variant="p" style={styles.subtitle}>
                                Udfyld felterne nedenfor og vælg en kategori.
                            </AppText>
                        </View>

                        <Pressable
                            onPress={onClose}
                            hitSlop={12}
                            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                        >
                            <AppText style={styles.closeButtonText}>✕</AppText>
                        </Pressable>
                    </View>

                    <View style={styles.section}>
                        <AppText variant="p" style={styles.sectionLabel}>
                            Kategori
                        </AppText>

                        <Pressable
                            onPress={() => setIsCategoryOpen((prev) => !prev)}
                            style={({ pressed }) => [
                                styles.dropdownTrigger,
                                pressed && styles.dropdownTriggerPressed,
                            ]}
                        >
                            <AppText style={styles.dropdownText}>{category}</AppText>
                            <AppText style={styles.dropdownChevron}>{isCategoryOpen ? "▲" : "▼"}</AppText>
                        </Pressable>

                        {isCategoryOpen && (
                            <View style={styles.dropdownMenu}>
                                {categories.map((c, idx) => {
                                    const isSelected = c === category;
                                    const isLast = idx === categories.length - 1;

                                    return (
                                        <Pressable
                                            key={c}
                                            onPress={() => {
                                                setCategory(c);
                                                setIsCategoryOpen(false);
                                            }}
                                            style={({ pressed }) => [
                                                styles.dropdownItem,
                                                isSelected && styles.dropdownItemSelected,
                                                pressed && styles.dropdownItemPressed,
                                                isLast && styles.dropdownItemLast,
                                            ]}
                                        >
                                            <AppText
                                                style={[
                                                    styles.dropdownItemText,
                                                    isSelected && styles.dropdownItemTextSelected,
                                                ]}
                                            >
                                                {c}
                                            </AppText>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Input
                            label="Beskrivelse"
                            value={name}
                            onChangeText={setName}
                            placeholder="fx Morgenmad"
                        />
                    </View>

                    <View style={styles.section}>
                        <Input
                            label="Beløb (kr.)"
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="fx 150"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <AppText style={styles.switchLabel}>Luksus udgift</AppText>
                        <Switch
                            value={isLuxury}
                            onValueChange={setIsLuxury}
                            trackColor={{
                                false: theme.colors.border,
                                true: theme.colors.luxury,
                            }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.actions}>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnSecondary,
                                pressed && styles.btnSecondaryPressed,
                            ]}
                        >
                            <AppText style={styles.btnSecondaryText}>Annuller</AppText>
                        </Pressable>

                        <Pressable
                            onPress={handleAdd}
                            style={({ pressed }) => [
                                styles.btn,
                                styles.btnPrimary,
                                pressed && styles.btnPrimaryPressed,
                            ]}
                        >
                            <AppText style={styles.btnPrimaryText}>Tilføj</AppText>
                        </Pressable>
                    </View>
                </Card>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        padding: theme.spacing.lg,
        backgroundColor: "rgba(2, 6, 23, 0.55)",
    },

    modalCard: {
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        gap: theme.spacing.md,
        backgroundColor: theme.colors.background,
        shadowColor: "#0F172A",
        shadowOpacity: 0.14,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: theme.spacing.md,
    },
    headerText: {
        flex: 1,
        gap: theme.spacing.xs,
    },

    title: {
        color: theme.colors.textPrimary,
    },
    subtitle: {
        color: theme.colors.textSecondary,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.labelBg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    closeButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    closeButtonText: {
        color: theme.colors.textSecondary,
        fontWeight: "700",
        fontSize: 16,
        lineHeight: 18,
    },

    section: {
        gap: theme.spacing.sm,
    },
    sectionLabel: {
        color: theme.colors.textSecondary,
    },

    dropdownTrigger: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownTriggerPressed: {
        borderColor: theme.colors.borderFocus,
    },
    dropdownText: {
        color: theme.colors.textPrimary,
        fontWeight: "700",
    },
    dropdownChevron: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },

    dropdownMenu: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
        overflow: "hidden",
    },
    dropdownItem: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
        backgroundColor: theme.colors.background,
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownItemSelected: {
        backgroundColor: theme.colors.primaryDisabled,
    },
    dropdownItemPressed: {
        backgroundColor: theme.colors.labelBg,
    },
    dropdownItemText: {
        color: theme.colors.textPrimary,
        fontWeight: "500",
    },
    dropdownItemTextSelected: {
        fontWeight: "800",
        color: theme.colors.primary,
    },

    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: "#D5bbec",
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    switchLabel: {
        color: theme.colors.textPrimary,
        fontWeight: "700",
    },

    actions: {
        flexDirection: "row",
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },

    btn: {
        flex: 1,
        minHeight: 46,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: theme.radius.pill,
        alignItems: "center",
        justifyContent: "center",
    },

    btnPrimary: {
        backgroundColor: theme.colors.primary,
        shadowColor: "#0F172A",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    btnPrimaryPressed: {
        backgroundColor: theme.colors.primaryPressed,
        transform: [{ scale: 0.99 }],
        opacity: 0.98,
    },
    btnPrimaryText: {
        color: theme.colors.textOnPrimary,
        fontWeight: "800",
    },

    btnSecondary: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    btnSecondaryPressed: {
        backgroundColor: theme.colors.labelBg,
        transform: [{ scale: 0.99 }],
        opacity: 0.98,
    },
    btnSecondaryText: {
        color: theme.colors.textPrimary,
        fontWeight: "800",
    },
});           