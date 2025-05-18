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
  ScrollView,
} from 'react-native';

export default function ProductsScreen({ setScreen }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Detail modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = `http://192.168.0.185:3000/api/products`;

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      const data = JSON.parse(text);
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to fetch products. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || isNaN(price)) {
      Alert.alert('Validation Error', 'Name and Price are required.');
      return;
    }

    const product = { name, description, price: parseFloat(price) };
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        fetchProducts();
        setModalVisible(false);
        resetForm();
        Alert.alert(editingId ? 'Product Updated!' : 'Product Added!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save product.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>+ Add Product</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedProduct(item);
              setDetailModalVisible(true);
            }}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>Rs. {item.price}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the card onPress
                  setName(item.name);
                  setDescription(item.description);
                  setPrice(String(item.price));
                  setEditingId(item.id);
                  setModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the card onPress
                  deleteProduct(item.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add/Edit Product Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TextInput
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Description"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 80 }]}
                multiline
              />
              <TextInput
                placeholder="Price"
                placeholderTextColor="#aaa"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>
                    {editingId ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Detailed View Modal */}
      <Modal visible={detailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Product Details</Text>
              {selectedProduct ? (
                <>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailText}>{selectedProduct.name}</Text>

                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailText}>
                    {selectedProduct.description || 'No description'}
                  </Text>

                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailText}>Rs. {selectedProduct.price}</Text>
                </>
              ) : (
                <Text style={styles.detailText}>No product selected.</Text>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { marginTop: 20 }]}
                onPress={() => setDetailModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },

  addButton: {
    backgroundColor: '#ff4081',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  card: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#333',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ff4081',
    marginBottom: 6,
  },

  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff80ab',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginLeft: 8,
  },

  editButton: {
    backgroundColor: '#ff4081',
  },

  deleteButton: {
    backgroundColor: '#dc3545',
  },

  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 15,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#ff4081',
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  submitButton: {
    backgroundColor: '#ff4081',
  },

  cancelButton: {
    backgroundColor: '#555',
  },

  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  detailModalContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 15,
  },

  detailLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff4081',
    marginTop: 12,
    marginBottom: 6,
  },

  detailText: {
    fontSize: 16,
    color: '#eee',
    lineHeight: 22,
  },
});
