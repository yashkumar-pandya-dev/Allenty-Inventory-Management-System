import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function UserProfileScreen({ navigation }) {
  const systemScheme = useColorScheme();           // 'light' | 'dark'
  const [notifications, setNotifications] = useState(true);
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist dark mode choice
  const handleDarkToggle = async (value) => {
    setIsDark(value);
    await AsyncStorage.setItem('darkMode', value ? 'true' : 'false');
  };

  // Load saved dark mode pref on mount
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const saved = await AsyncStorage.getItem('darkMode');
        if (saved !== null) setIsDark(saved === 'true');
      };
      init();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchMe = async () => {
        setLoading(true);
        try {
          const res = await client.get('/me/');
          setUser(res.data);
        } catch (err) {
          console.error('Failed to fetch user:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMe();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const roleName = user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Staff' : 'Warehouse Manager';
  const t = isDark ? dark : light;   // theme shorthand

  return (
    <ScrollView style={[styles.container, t.container]} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={[styles.pageTitle, t.text]}>Profile & Settings</Text>

      {/* Profile Card */}
      <View style={[styles.card, t.card]}>
        <Text style={[styles.cardTitle, t.cardTitle]}>Profile Information</Text>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#2563EB" />
            <Text style={[styles.loadingText, t.subText]}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.initials || '??'}</Text>
              </View>
              <View>
                <Text style={[styles.name, t.text]}>{user?.full_name || user?.username || '—'}</Text>
                <Text style={styles.role}>{roleName}</Text>
              </View>
            </View>
            {[['Username', user?.username], ['Email', user?.email || '—'], ['Employee ID', user?.id ? `#${user.id}` : '—']].map(([label, val]) => (
              <View key={label} style={[styles.infoRow, t.infoRow]}>
                <Text style={[styles.label, t.subText]}>{label}</Text>
                <Text style={[styles.value, t.text]}>{val}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Preferences Card */}
      <View style={[styles.card, t.card]}>
        <Text style={[styles.cardTitle, t.cardTitle]}>Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="bell" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.settingLabel, t.text]}>Notifications</Text>
              <Text style={[styles.settingSub, t.subText]}>Receive stock alerts</Text>
            </View>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#767577', true: '#2563EB' }} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="moon" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.settingLabel, t.text]}>Dark Mode</Text>
              <Text style={[styles.settingSub, t.subText]}>Toggle app theme</Text>
            </View>
          </View>
          <Switch value={isDark} onValueChange={handleDarkToggle} trackColor={{ false: '#767577', true: '#2563EB' }} />
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutBtn, t.logoutBtn]} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#EF4444" style={{ marginRight: 10 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  card: { borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', paddingBottom: 15, marginBottom: 15, borderBottomWidth: 1 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, justifyContent: 'center' },
  loadingText: { marginLeft: 10, fontWeight: '500' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  role: { color: '#2563EB', fontWeight: '600' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  label: { fontWeight: '500' },
  value: { fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  settingInfo: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  settingSub: { fontSize: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderWidth: 1, borderRadius: 12, marginTop: 10 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});

// Light theme overrides
const light = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  card: { backgroundColor: '#fff' },
  cardTitle: { color: '#111827', borderBottomColor: '#F3F4F6' },
  text: { color: '#111827' },
  subText: { color: '#6B7280' },
  infoRow: { borderBottomColor: '#F9FAFB' },
  logoutBtn: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
});

// Dark theme overrides
const dark = StyleSheet.create({
  container: { backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b' },
  cardTitle: { color: '#f1f5f9', borderBottomColor: '#334155' },
  text: { color: '#f1f5f9' },
  subText: { color: '#94a3b8' },
  infoRow: { borderBottomColor: '#1e293b' },
  logoutBtn: { backgroundColor: '#1e293b', borderColor: '#7f1d1d' },
});
