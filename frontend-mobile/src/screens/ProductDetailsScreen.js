import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import client from '../api/client';
import StatusBadge from '../components/StatusBadge';
import OfflineManager from '../services/OfflineManager';
import NetInfo from '@react-native-community/netinfo';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product: initialProduct } = route.params || {};

  const [product, setProduct] = useState(initialProduct || {
    id: 0, name: 'Loading...', sku: '...', quantity: 0, min_stock_level: 0, category: '', location: ''
  });
  const [adjustAmount, setAdjustAmount] = useState('1');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!initialProduct) {
      navigation.goBack();
    }
    const unsubscribe = NetInfo.addEventListener(state => setIsConnected(state.isConnected));
    return unsubscribe;
  }, []);

  const updateStock = async (action) => {
    const amount = parseInt(adjustAmount);
    if (!amount || isNaN(amount)) {
      Alert.alert("Error", "Please enter a valid number");
      return;
    }

    const newQty = action === 'add' ? product.quantity + amount : product.quantity - amount;

    if (newQty < 0) {
      Alert.alert("Error", "Stock cannot be negative");
      return;
    }

    if (!isConnected) {
      const saved = await OfflineManager.addToQueue('UPDATE_STOCK', { id: product.id, quantity: newQty });
      if (saved) {
        setProduct({ ...product, quantity: newQty });
        Alert.alert("Saved Offline", "Stock update queued.");
      }
      return;
    }

    try {
      const response = await client.patch(`/products/${product.id}/`, { quantity: newQty });
      setProduct(response.data);
      Alert.alert("Success", "Stock updated!");
    } catch (error) {
      console.log("Update Error:", error);
      Alert.alert("Update Failed", "Failed to update stock");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePlaceholder}><Text style={{fontSize: 50}}>📦</Text></View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{product.name}</Text>
          <StatusBadge stock={product.quantity} minStock={product.min_stock_level} />
        </View>
        <Text style={styles.sku}>SKU: {product.sku}</Text>


        <View style={styles.card}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Quantity</Text>
              <Text style={styles.value}>{product.quantity}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{product.category || "Uncategorized"}</Text>
            </View>
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{product.location || "Unassigned"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Adjust Stock</Text>
        <View style={styles.stepper}>
            <TouchableOpacity style={[styles.stepBtn, {backgroundColor: '#EF4444'}]} onPress={() => updateStock('remove')}>
              <Text style={styles.stepText}>- Remove</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={adjustAmount}
              onChangeText={setAdjustAmount}
              keyboardType="numeric"
            />

            <TouchableOpacity style={[styles.stepBtn, {backgroundColor: '#10B981'}]} onPress={() => updateStock('add')}>
              <Text style={styles.stepText}>+ Add</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  imagePlaceholder: { height: 200, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F3F4F6' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  sku: { color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridItem: { flex: 1 },
  label: { color: '#666', fontSize: 12 },
  value: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepBtn: { padding: 15, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  stepText: { color: '#fff', fontWeight: 'bold' },
  input: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', minWidth: 50, backgroundColor: 'white', padding: 10, borderRadius: 8 },
});

export default ProductDetailsScreen;