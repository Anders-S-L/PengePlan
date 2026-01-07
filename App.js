import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const STORAGE_KEYS = {
  hasBudget: 'pengeplan:hasBudget',
  budgetName: 'pengeplan:budgetName',
  budgetAmount: 'pengeplan:budgetAmount',
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasBudget, setHasBudget] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  useEffect(() => {
    const loadBudgetState = async () => {
      const [storedHasBudget, storedName, storedAmount] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.hasBudget),
        AsyncStorage.getItem(STORAGE_KEYS.budgetName),
        AsyncStorage.getItem(STORAGE_KEYS.budgetAmount),
      ]);

      if (storedHasBudget === 'true') {
        setHasBudget(true);
        setBudgetName(storedName ?? '');
        setBudgetAmount(storedAmount ?? '');
      }

      setIsLoading(false);
    };

    loadBudgetState();
  }, []);

  const canSave = useMemo(() => {
    const amount = Number(budgetAmount.replace(',', '.'));
    return budgetName.trim().length > 0 && Number.isFinite(amount) && amount > 0;
  }, [budgetAmount, budgetName]);

  const normalizeAmount = (amountText) => amountText.replace(',', '.');

  const saveBudget = async () => {
    if (!canSave) {
      return;
    }

    const normalizedAmount = normalizeAmount(budgetAmount);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.hasBudget, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.budgetName, budgetName.trim()),
      AsyncStorage.setItem(STORAGE_KEYS.budgetAmount, normalizedAmount),
    ]);

    setHasBudget(true);
  };

  const handleCreateBudget = async () => {
    await saveBudget();
  };

  const handleUpdateBudget = async () => {
    await saveBudget();
  };

  const handleDeleteBudget = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.hasBudget,
      STORAGE_KEYS.budgetName,
      STORAGE_KEYS.budgetAmount,
    ]);

    setHasBudget(false);
    setBudgetName('');
    setBudgetAmount('');
  };

  if (isLoading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Indlæser PengePlan...</Text>
        </View>
    );
  }

  if (!hasBudget) {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Velkommen til PengePlan</Text>
          <Text style={styles.subtitle}>
            Det ser ud til, at du er ny her. Lad os oprette dit første budget.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Budgetnavn</Text>
            <TextInput
                placeholder="Fx Månedligt budget"
                value={budgetName}
                onChangeText={setBudgetName}
                style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Samlet beløb (DKK)</Text>
            <TextInput
                placeholder="Fx 12000"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
                style={styles.input}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
                title="Opret første budget"
                onPress={handleCreateBudget}
                disabled={!canSave}
                color="#1e3a8a"
            />
          </View>
          <StatusBar style="auto" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text style={styles.title}>Dit første budget er klar 🎉</Text>
        <Text style={styles.subtitle}>
          Budgettet indlæses hver gang du åbner appen, og ændringer bliver gemt.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Budget</Text>
          <Text style={styles.summaryValue}>{budgetName}</Text>

          <Text style={styles.summaryLabel}>Samlet beløb</Text>
          <Text style={styles.summaryValue}>{budgetAmount} DKK</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rediger budgetnavn</Text>
          <TextInput
              value={budgetName}
              onChangeText={setBudgetName}
              style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rediger samlet beløb (DKK)</Text>
          <TextInput
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
              style={styles.input}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
              title="Gem ændringer"
              onPress={handleUpdateBudget}
              disabled={!canSave}
              color="#1e3a8a"
          />
        </View>

        <View style={styles.deleteButtonWrapper}>
          <Button
              title="Slet budget"
              onPress={handleDeleteBudget}
              color="#dc2626"
          />
        </View>

        <Text style={styles.helperText}>
          Du kan nu begynde at tilføje udgifter og planlægge dine næste trin.
        </Text>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 8,
  },
  deleteButtonWrapper: {
    width: '100%',
    marginTop: 12,
    marginBottom: 16,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
});