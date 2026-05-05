import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import client from '../api/client';

const AddProductScreen = ({ route, navigation }) => {
  const { sku } = route.params || { sku: '' };

  const [name, setName] = useState('');
  const [currentSku, setCurrentSku] = useState(sku); 
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(''); 
  const [quantity, setQuantity] = useState('0');
  const [minStock, setMinStock] = useState('5');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !currentSku) {
      Alert.alert("Missing Data", "Name and SKU are required.");
      return;
    }

    setLoading(true);
    try {
      await client.post('/products/', {
        name: name,
        sku: currentSku,
        category: category, 
        location: location, 
        quantity: parseInt(quantity) || 0,
        min_stock_level: parseInt(minStock) || 0,
        description: "Added via Mobile App"
      });

      Alert.alert("Success", "Product added to inventory!", [
        { text: "OK", onPress: () => navigation.replace('MainApp') }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save product. SKU might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Wireless Mouse" 
          value={name} 
          onChangeText={setName} 
        />

        <Text style={styles.label}>SKU / Barcode</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: '#F3F4F6' }]} 
          value={currentSku} 
          onChangeText={setCurrentSku}
          editable={true} 
        />

        <Text style={styles.label}>Category</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Electronics" 
          value={category} 
          onChangeText={setCategory} 
        />

        <Text style={styles.label}>Warehouse Location</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Aisle 4, Shelf B" 
          value={location} 
          onChangeText={setLocation} 
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput 
              style={styles.input} 
              value={quantity} 
              onChangeText={setQuantity} 
              keyboardType="numeric" 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Min Stock</Text>
            <TextInput 
              style={styles.input} 
              value={minStock} 
              onChangeText={setMinStock} 
              keyboardType="numeric" 
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.btn, loading && { opacity: 0.7 }]} 
          onPress={handleSave} 
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Saving..." : "Save Product"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12 },
  label: { fontWeight: 'bold', color: '#374151', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default AddProductScreen;