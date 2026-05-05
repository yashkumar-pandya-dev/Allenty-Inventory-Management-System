import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import client from '../api/client';

export default function AppInventoryScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProducts = async () => {
    try {
      const res = await client.get(`/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, currentQty, action) => {
    const newQty = action === 'add' ? currentQty + 1 : currentQty - 1;
    if (newQty < 0) return;

    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty } : p));

    try {
      await client.patch(`/products/${id}/`, { quantity: newQty });
    } catch (err) {
      Alert.alert("Error", "Could not update stock");
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    Alert.alert("Delete Item", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await client.delete(`/products/${id}/`);
              setProducts(prev => prev.filter(p => p.id !== id));
            } catch (err) {
              Alert.alert("Error", "Could not delete item");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.sku}>{item.sku}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category || 'Uncategorized'}</Text>
            </View>
            <View style={styles.locationBadge}>
              <Feather name="map-pin" size={10} color="#6B7280" />
              <Text style={styles.locationText}>{item.location || 'Unassigned'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.deleteBtn}>
           <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => updateStock(item.id, item.quantity, 'remove')} style={[styles.controlBtn, styles.removeBtn]}>
            <Feather name="minus" size={18} color="#EF4444" />
          </TouchableOpacity>

          <View style={[styles.qtyBadge, item.quantity <= item.min_stock_level ? styles.lowStock : styles.goodStock]}>
            <Text style={[styles.qtyText, item.quantity <= item.min_stock_level ? styles.lowStockText : styles.goodStockText]}>
              {item.quantity}
            </Text>
          </View>

          <TouchableOpacity onPress={() => updateStock(item.id, item.quantity, 'add')} style={[styles.controlBtn, styles.addBtn]}>
            <Feather name="plus" size={18} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddProduct', { sku: '' })} 
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 40, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  sku: { fontSize: 12, color: '#9CA3AF', marginTop: 2, marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  categoryBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: 'bold', color: '#1E40AF' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  locationText: { fontSize: 10, color: '#4B5563', marginLeft: 4, fontWeight: '600' },
  deleteBtn: { padding: 5, marginLeft: 10 },
  cardBody: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  removeBtn: { backgroundColor: '#FEF2F2' },
  addBtn: { backgroundColor: '#ECFDF5' },
  qtyBadge: { minWidth: 45, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1 },
  goodStock: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
  lowStock: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
  qtyText: { fontWeight: 'bold', fontSize: 16 },
  goodStockText: { color: '#047857' },
  lowStockText: { color: '#B91C1C' },
  
  // 👇 Floating Action Button Styles
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 25,
    backgroundColor: '#1E3A8A', // Matches your premium dark blue theme
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    zIndex: 999
  }
});