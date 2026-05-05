import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import client from '../api/client';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await client.get('/products/');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const updateStock = async (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 0) return; 

    try {
      setProducts(prevProducts => 
        prevProducts.map(prod => 
          prod.id === id ? { ...prod, quantity: newQuantity } : prod
        )
      );

      await client.patch(`/products/${id}/`, { quantity: newQuantity });
      
    } catch (error) {
      Alert.alert("Error", "Failed to update stock");
      fetchProducts(); 
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSku}>SKU: {item.sku}</Text>
      </View>
      
      <View style={styles.stockContainer}>
        <TouchableOpacity 
          onPress={() => updateStock(item.id, item.quantity, -1)} 
          style={[styles.button, styles.minusButton]}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity 
          onPress={() => updateStock(item.id, item.quantity, 1)} 
          style={[styles.button, styles.plusButton]}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
  card: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  productSku: { fontSize: 12, color: '#9CA3AF' },
  stockContainer: { flexDirection: 'row', alignItems: 'center' },
  quantity: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, minWidth: 30, textAlign: 'center' },
  button: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  plusButton: { backgroundColor: '#10B981' },
  minusButton: { backgroundColor: '#EF4444' },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold', lineHeight: 22 }
});

export default HomeScreen;
