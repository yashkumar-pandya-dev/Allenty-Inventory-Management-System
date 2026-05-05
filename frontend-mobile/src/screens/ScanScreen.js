import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import client from '../api/client';

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => setScanned(false));
    return unsubscribe;
  }, [navigation]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100 }}>Need camera permission</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permBtn}><Text>Grant</Text></TouchableOpacity>
      </View>
    );
  }

 const handleBarCodeScanned = async ({ data }) => {
     if (scanned) return;
     setScanned(true);

     try {
       const response = await client.get(`/products/?search=${data}`);
       const exactMatch = response.data.find(p => p.sku === data);

       if (exactMatch) {
         navigation.navigate('ProductDetails', { product: exactMatch });
       } else {
         Alert.alert(
           "New Product Found",
           `SKU ${data} is not in inventory. Do you want to add it?`,
           [
             { text: "Cancel", onPress: () => setScanned(false), style: "cancel" },
             {
               text: "Add to Inventory",
               onPress: () => navigation.navigate('AddProduct', { sku: data })
             }
           ]
         );
       }
     } catch (error) {
       console.log(error);
       Alert.alert("Error", "Connection failed", [
         { text: "Retry", onPress: () => setScanned(false) }
       ]);
     }
   };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "pdf417"] }}
      >
        <SafeAreaView style={styles.overlay}>
           <View style={styles.headerRow}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
               <Feather name="x" size={28} color="white" />
             </TouchableOpacity>
           </View>

           <Text style={styles.scanText}>Scan Product Barcode</Text>
           <View style={styles.spacer} /> 
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  permBtn: { marginTop: 20, padding: 10, backgroundColor: '#ddd', alignSelf: 'center', borderRadius: 8 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'space-between' },
  
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  scanText: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  spacer: { flex: 1 }
});

export default ScanScreen;