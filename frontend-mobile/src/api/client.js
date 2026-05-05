import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


let API_URL = 'http://localhost:8000/api'; 

if (Platform.OS !== 'web') {
  API_URL = 'https://subpatellar-gonzalo-rurally.ngrok-free.dev/api';
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
      }
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
