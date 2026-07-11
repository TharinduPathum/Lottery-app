// app/(auth)/login.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@/constants/theme';  

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    // Input Validation
    if (!email || !password) {
      Alert.alert('Error', 'කරුණාකර Email සහ Password ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim(),
        password: password
      });

      if (response.data && response.data.token) {
        await login(response.data.token, response.data.user);
      } else {
        Alert.alert('Login Failed', 'Token එකක් ලැබුණේ නැත.');
      }
    } catch (error: any) {
      console.log('Login Error:', error);
      const errorMsg = error.response?.data?.message || 'ලොග් වීමට නොහැකි විය. නැවත උත්සාහ කරන්න.';
      Alert.alert('Login Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lucky Lottery 🎰</Text>
      <Text style={styles.subtitle}>ඔබේ ගිණුමට ලොග් වන්න</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#687076"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#687076"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerLink}>
        <Text style={styles.registerText}>අලුත් ගිණුමක් සාදාගන්න (Register)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0a7ea4',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#687076',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#0a7ea4',
    fontSize: 14,
  },
});