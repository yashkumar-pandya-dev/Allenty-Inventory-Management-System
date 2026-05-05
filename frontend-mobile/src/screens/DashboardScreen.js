import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function MainDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, lowStock: 0 });
  const [user, setUser] = useState({ full_name: '', initials: '' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, meRes] = await Promise.all([
        client.get('/products/'),
        client.get('/me/'),
      ]);
      const products = productsRes.data;
      setStats({
        total: products.length,
        lowStock: products.filter(p => p.quantity <= p.min_stock_level).length,
      });
      setUser(meRes.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.username}>{user.full_name || 'Manager'}!</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileInitials}>{user.initials || '??'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL PRODUCTS</Text>
          <Text style={styles.cardValue}>{stats.total}</Text>
          <Feather name="package" size={40} color="#E5E7EB" style={styles.cardIcon} />
        </View>

        <TouchableOpacity
          style={[styles.card, styles.alertCard]}
          onPress={() => navigation.navigate('Alerts')}
        >
          <View style={styles.alertHeader}>
            <Text style={[styles.cardLabel, styles.alertLabel]}>ACTION NEEDED</Text>
            <Feather name="alert-triangle" size={16} color="#EF4444" />
          </View>
          <Text style={[styles.cardValue, styles.alertValue]}>{stats.lowStock}</Text>
          <Text style={styles.alertSub}>products low stock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Inventory')}>
            <Feather name="list" size={24} color="#2563EB" />
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Reports')}>
            <Feather name="bar-chart-2" size={24} color="#10B981" />
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  welcome: { fontSize: 16, color: '#6B7280' },
  username: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  profileBtn: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center' },
  profileInitials: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '48%', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, position: 'relative', overflow: 'hidden' },
  cardLabel: { fontSize: 10, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 5 },
  cardValue: { fontSize: 32, fontWeight: '900', color: '#111827' },
  cardIcon: { position: 'absolute', bottom: -5, right: -5, opacity: 0.5 },
  alertCard: { borderColor: '#FEE2E2', borderWidth: 1, backgroundColor: '#FEF2F2' },
  alertLabel: { color: '#EF4444' },
  alertValue: { color: '#EF4444' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  alertSub: { fontSize: 10, color: '#EF4444', fontWeight: '600' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  actionGrid: { flexDirection: 'row', gap: 15 },
  actionBtn: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  actionText: { marginTop: 10, fontWeight: '600', color: '#374151' },
});
