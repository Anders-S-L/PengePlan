import { useState } from "react";
import { Modal, View } from "react-native";
import { AppText } from "../components/UI/AppText";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import { Card } from "../components/UI/Card";
import { Switch } from "react-native";
import { theme } from "../styles/theme";

const categories = [
    "Mad",
    "Transport",
    "Hjem,",
    "Shopping",
    "Underholding",
    "Andet",
];

export function AddVariableExpenseModal({ visible, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [isLuxury, setIsLuxury] = useState(false);
    const [category, setCategory] = useState(categories[0]);

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
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.3)" }}>
                <Card>

                    <AppText variant="h4">Tilføj ny udgift</AppText>
                    <AppText variant="p">Kategori</AppText>

                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                        {categories.map((c) => (
                            <Button
                                key={c}
                                title={c}
                                onPress={() => setCategory(c)}
                            />
                        ))}
                    </View>
                    <View style={{ marginTop: 12 }}>
                        <Input label="Beskrivelse" value={name} onChangeText={setName} placeholder="fx Morgenmad" />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Input label="Beløb (kr.)" value={amount} onChangeText={setAmount} placeholder="fx 150" />
                    </View>
                    <AppText>Luksus udgift</AppText>


                    <Switch
                        value={isLuxury}
                        onValueChange={setIsLuxury}
                        trackColor={{
                            false: "#D1D5DB",
                            true: theme.colors.primary,
                        }}
                        thumbColor="#FFFFFF"
                    />

                    <View style={{ flexDirection: "row", gap: 12, marginTop: 16, justifyContent: "flex-end" }}>
                        <Button title="Annuller" onPress={onClose} />

                        <Button title="Tilføj" onPress={handleAdd} />
                    </View>
                </Card>
            </View>
        </Modal>
    );
}