import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import client from '../api/client';

const InlineStatusBadge = ({ stock, minStock }) => {
  const isLow = stock <= minStock;
  return (
    <View style={[styles.badgeContainer, isLow ? styles.lowBadge : styles.goodBadge]}>
      <Feather name={isLow ? "alert-triangle" : "check-circle"} size={14} color={isLow ? "#EF4444" : "#10B981"} />
      <Text style={[styles.badgeText, isLow ? styles.lowText : styles.goodText]}>
        {isLow ? 'Low Stock' : 'Healthy'}
      </Text>
    </View>
  );
};

export default function AppAlertsScreen({ navigation }) {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
    
      const response = await client.get('/products/');
      const critical = response.data.filter(p => p.quantity <= p.min_stock_level);
      setLowStockItems(critical);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlerts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Feather name="alert-triangle" size={28} color="#EF4444" />
          <Text style={styles.title}>Action Needed</Text>
        </View>
        <Text style={styles.subtitle}>
          {lowStockItems.length} products are currently below their minimum stock level.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#EF4444" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={lowStockItems}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={60} color="#10B981" />
              <Text style={styles.emptyTitle}>All Good!</Text>
              <Text style={styles.emptySub}>Your inventory levels are healthy.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <View style={styles.row}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.skuText}>SKU: {item.sku}</Text>
                </View>
                <InlineStatusBadge stock={item.quantity} minStock={item.min_stock_level} />
              </View>

              <View style={styles.stockBarBg}>
                <View style={[styles.stockBarFill, { width: `${Math.max((item.quantity / item.min_stock_level) * 100, 5)}%` }]} />
              </View>

              <Text style={styles.shortageText}>
                Current: {item.quantity}  •  Minimum Required: {item.min_stock_level}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FEF2F2', borderBottomWidth: 1, borderBottomColor: '#FEE2E2' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#B91C1C', marginLeft: 10 },
  subtitle: { color: '#991B1B', fontSize: 14, fontWeight: '500' },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#FEF2F2' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  skuText: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },

  stockBarBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  stockBarFill: { height: '100%', backgroundColor: '#EF4444', borderRadius: 3 },
  shortageText: { color: '#EF4444', fontWeight: 'bold', fontSize: 12 },

  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 15 },
  emptySub: { color: '#6B7280', marginTop: 5 },


  badgeContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  lowBadge: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2', borderWidth: 1 },
  goodBadge: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5', borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  lowText: { color: '#EF4444' },
  goodText: { color: '#10B981' }
});