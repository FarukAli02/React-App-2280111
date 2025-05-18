import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // NEW: detail modal state
  const [detailItem, setDetailItem] = useState(null);

  const API_URL = 'http://192.168.0.185:3000/api/inventory';

  // Fetch inventory from backend
  const loadInventory = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      const data = JSON.parse(text);
      setInventory(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      Alert.alert('Fetch Failed', 'Could not load inventory.');
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const clearForm = () => {
    setProductId('');
    setQuantity('');
    setLocation('');
    setCurrentId(null);
  };

  // Add or update inventory item
  const saveInventory = async () => {
    if (!productId.trim() || !quantity.trim() || !location.trim()) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    const inventoryData = {
      product_id: Number(productId.trim()),
      quantity: Number(quantity.trim()),
      location: location.trim(),
    };

    const url = currentId ? `${API_URL}/${currentId}` : API_URL;
    const method = currentId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData),
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          currentId ? 'Inventory updated successfully!' : 'Inventory added successfully!'
        );
        loadInventory();
        clearForm();
        setModalVisible(false);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save inventory.');
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Inventory',
      'Are you sure you want to delete this inventory item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteInventory(id),
        },
      ]
    );
  };

  // Delete inventory item
  const deleteInventory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        Alert.alert('Deleted', 'Inventory item deleted successfully.');
        loadInventory();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete inventory item.');
    }
  };

  // Render each inventory item
  const renderInventory = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setDetailItem(item)}
      style={styles.inventoryItem}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.productId}>Product ID: {item.product_id}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.location}>Location: {item.location}</Text>
        <Text style={styles.lastUpdated}>
          Last Updated: {new Date(item.last_update || item.created_at).toLocaleString()}
        </Text>
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.editBtn]}
          onPress={(e) => {
            e.stopPropagation(); // Prevent opening detail modal
            setProductId(String(item.product_id));
            setQuantity(String(item.quantity));
            setLocation(item.location);
            setCurrentId(item.id);
            setModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteBtn]}
          onPress={(e) => {
            e.stopPropagation(); // Prevent opening detail modal
            confirmDelete(item.id);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          clearForm();
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ New Inventory</Text>
      </TouchableOpacity>

      {inventory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No inventory items found. Add some!</Text>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInventory}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {currentId ? 'Edit Inventory' : 'Add Inventory'}
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Product Name"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              value={productId}
              onChangeText={setProductId}
              autoFocus
            />
            <TextInput
              style={styles.inputField}
              placeholder="Quantity"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              style={[styles.inputField, { height: 80 }]}
              placeholder="Location"
              placeholderTextColor="#bbb"
              value={location}
              onChangeText={setLocation}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveInventory}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>{currentId ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  clearForm();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* NEW: Detail Modal */}
      <Modal visible={!!detailItem} transparent animationType="fade">
        <View style={styles.detailOverlay}>
          <View style={styles.detailBox}>
            <Text style={styles.detailTitle}>Inventory Details</Text>
            {detailItem && (
              <>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Product ID: </Text>
                  {detailItem.product_id}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Quantity: </Text>
                  {detailItem.quantity}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Location: </Text>
                  {detailItem.location}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Last Updated: </Text>
                  {new Date(detailItem.last_update || detailItem.created_at).toLocaleString()}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.detailCloseButton}
              onPress={() => setDetailItem(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // pure black background
    padding: 20,
  },

  addButton: {
    backgroundColor: '#e91e63', // pink (pink 500)
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#e91e63',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 7,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: '#bbb',
    fontSize: 18,
  },

  inventoryItem: {
    backgroundColor: '#1a1a1a', // dark gray/black
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },

  productId: {
    fontSize: 18,
    color: '#f48fb1', // light pink
    fontWeight: '700',
  },

  quantity: {
    fontSize: 16,
    color: '#ddd',
  },

  location: {
    fontSize: 16,
    color: '#ddd',
    fontStyle: 'italic',
  },

  lastUpdated: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 6,
  },

  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 12,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  editBtn: {
    backgroundColor: '#c2185b', // dark pink/magenta
  },

   deleteBtn: {
     backgroundColor: '#dc3545',
   },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000a',
    padding: 20,
  },

  modalBox: {
    backgroundColor: '#222', // dark background for modal
    borderRadius: 18,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f48fb1', // light pink text
    marginBottom: 12,
    textAlign: 'center',
  },

  inputField: {
    backgroundColor: '#1a1a1a',
    color: '#eee',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c2185b', // dark pink border
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },

  saveButton: {
    backgroundColor: '#e91e63', // pink save
  },

  cancelButton: {
    backgroundColor: '#d32f2f', // red cancel
  },

  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Detail modal styles
  detailOverlay: {
    flex: 1,
    backgroundColor: '#000c', // darker translucent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  detailBox: {
    backgroundColor: '#222',
    borderRadius: 18,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },

  detailTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f48fb1',
    marginBottom: 20,
  },

  detailText: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 12,
    textAlign: 'center',
  },

  detailLabel: {
    fontWeight: '700',
    color: '#e91e63',
  },

  detailCloseButton: {
    marginTop: 20,
    backgroundColor: '#e91e63',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },

  detailCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
