import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import client from '../api/client';

export default function ReportsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState({
    totalUniqueItems: 0,
    totalPhysicalStock: 0,
    criticalItems: 0,
    healthyItems: 0,
    categories: {}
  });

  const generateReport = async () => {
    try {
      const res = await client.get('/products/');
      const products = res.data;

      let totalPhysical = 0;
      let criticalCount = 0;
      let healthyCount = 0;
      let categoryMap = {};

      products.forEach(product => {
        totalPhysical += product.quantity;
        
        if (product.quantity <= product.min_stock_level) {
          criticalCount++;
        } else {
          healthyCount++;
        }

        const cat = product.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      setReportData({
        totalUniqueItems: products.length,
        totalPhysicalStock: totalPhysical,
        criticalItems: criticalCount,
        healthyItems: healthyCount,
        categories: categoryMap
      });

    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      generateReport();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await generateReport();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Report</Text>
        <Text style={styles.subtitle}>Real-time overview of your warehouse.</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
             <Feather name="layers" size={24} color="#1E3A8A" />
          </View>
          <Text style={styles.cardValue}>{reportData.totalUniqueItems}</Text>
          <Text style={styles.cardLabel}>Unique Products (SKUs)</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
             <Feather name="box" size={24} color="#9333EA" />
          </View>
          <Text style={styles.cardValue}>{reportData.totalPhysicalStock}</Text>
          <Text style={styles.cardLabel}>Total Physical Items</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Stock Health</Text>
      <View style={styles.healthContainer}>
        <View style={[styles.healthBar, { flex: reportData.healthyItems || 1, backgroundColor: '#10B981' }]} />
        <View style={[styles.healthBar, { flex: reportData.criticalItems || 0.1, backgroundColor: '#EF4444' }]} />
      </View>
      
      <View style={styles.healthLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Healthy ({reportData.healthyItems})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Critical/Low ({reportData.criticalItems})</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <View style={styles.listCard}>
        {Object.keys(reportData.categories).length === 0 ? (
           <Text style={{color: '#6B7280', padding: 10}}>No categories found.</Text>
        ) : (
          Object.entries(reportData.categories).map(([catName, count], index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listCatName}>{catName}</Text>
              <Text style={styles.listCatCount}>{count} items</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { marginTop: 20, marginBottom: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 5 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  card: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardValue: { fontSize: 28, fontWeight: '900', color: '#111827' },
  cardLabel: { fontSize: 12, color: '#6B7280', marginTop: 5, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15, marginTop: 10 },
  healthContainer: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 15 },
  healthBar: { height: '100%' },
  healthLegend: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  listCard: { backgroundColor: '#fff', borderRadius: 16, padding: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 40 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  listCatName: { fontSize: 15, fontWeight: '600', color: '#374151' },
  listCatCount: { fontSize: 15, color: '#6B7280' }
});