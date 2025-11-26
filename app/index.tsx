import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState({ bmi: '', category: '' });
  const [loading, setLoading] = useState(false);

  async function calculateIMC() {
    Keyboard.dismiss();
    setResult({ bmi: '', category: '' });

    if (!weight || !height) {
      Alert.alert("Erro", "Por favor, preencha o peso e a altura.");
      return;
    }

    const formattedWeight = weight.replace(',', '.');
    const formattedHeight = height.replace(',', '.');

    setLoading(true);

    try {
      const url = `https://bmicalculatorapi.vercel.app/api/bmi/${formattedWeight}/${formattedHeight}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Falha na comunicação com a API');
      }

      const data = await response.json();

      setResult({
        bmi: data.bmi,
        category: data.Category
      });

    } catch (error) {
      Alert.alert("Erro", "Não foi possível calcular o IMC. Verifique sua conexão ou os valores digitados.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function getResultStyle(category: string) {
    const text = category ? category.toLowerCase() : '';

    if (text.includes('underweight')) return { color: '#e67e22', icon: '⚠️' };
    if (text.includes('normal weight')) return { color: '#27ae60', icon: '✅' };
    if (text.includes('overweight')) return { color: '#f39c12', icon: '⚖️' };
    if (text.includes('obesity')) return { color: '#c0392b', icon: '🚨' };

    return { color: '#333', icon: 'ℹ️' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Calculadora de IMC</Text>
        <Text style={styles.subtitle}>ENTREGA - PROGRAMAR DISPOSITIVOS MÓVEIS E IOT </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 70.5"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1.75"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={calculateIMC}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>CALCULAR IMC</Text>
          )}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Seu IMC é:</Text>
            <Text style={styles.bmiValue}>{parseFloat(result.bmi).toFixed(2)}</Text>

            <View style={styles.categoryContainer}>
              <Text style={styles.icon}>
                {getResultStyle(result.category).icon}
              </Text>
              <Text style={[
                styles.categoryText,
                { color: getResultStyle(result.category).color }
              ]}>
                {result.category}
              </Text>
            </View>

            <Text style={styles.message}>
              Confira a classificação acima baseada no índice oficial de massa corporal.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  resultLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 10,
    fontSize: 14,
  },
});