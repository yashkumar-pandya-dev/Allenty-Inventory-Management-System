import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import client from '../api/client';

export default function AuthLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await client.post('/token/', { username, password });

      await AsyncStorage.setItem('accessToken', res.data.access);
      await AsyncStorage.setItem('refreshToken', res.data.refresh);
      navigation.replace('MainApp');
    } catch (err) {
      console.log(err);
      Alert.alert('Login Failed', 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.circleDecoration} />
        <Text style={styles.appTitle}>ALLENTY{'\n'}INVENTORY</Text>
        <Text style={styles.appSubtitle}>
        VRAJ PATEL || YASHKUMAR PANDYA ||KRISH TRIVEDI{'\n'}
        DEVKUMAR CHHATRALA || PRIYA RANA || PRANAV PATEL
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
            <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>
        <Text style={styles.welcomeText}>Admin Login</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="admin"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E3A8A' },
  header: { flex: 0.35, justifyContent: 'center', padding: 30, position: 'relative', overflow: 'hidden' },
  circleDecoration: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#1e40af', opacity: 0.5 },
  appTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 10 },
  appSubtitle: { fontSize: 10, color: '#BFDBFE', lineHeight: 16, fontWeight: '600' },
  formContainer: { flex: 0.65, backgroundColor: '#F9FAFB', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  logoContainer: { marginBottom: 10, alignItems: 'flex-start' },
  logoImage: { width: 140, height: 45 },
  
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10 },
  icon: { marginLeft: 10 },
  input: { flex: 1, padding: 12, color: '#111' },
  button: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 4 } },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgotText: { textAlign: 'center', color: '#2563EB', marginTop: 20, fontWeight: '600' }
});