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

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [note, setNote] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // New state for detail modal
  const [detailCategory, setDetailCategory] = useState(null);

  const API_URL = 'http://192.168.0.185:3000/api/category';

  // Fetch categories from backend
  const loadCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      const data = JSON.parse(text);
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      Alert.alert('Fetch Failed', 'Could not load categories.');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const clearForm = () => {
    setCategoryName('');
    setNote('');
    setCurrentId(null);
  };

  // Add or update category
  const saveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Validation Error', 'Category name cannot be empty.');
      return;
    }

    const categoryData = { name: categoryName.trim(), note: note.trim() };
    const url = currentId ? `${API_URL}/${currentId}` : API_URL;
    const method = currentId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (response.ok) {
        Alert.alert(
          'Success',
          currentId ? 'Category updated successfully!' : 'Category added successfully!'
        );
        loadCategories();
        clearForm();
        setModalVisible(false);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save category.');
    }
  };

  // Delete category with confirmation
  const confirmDelete = (id, name) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(id),
        },
      ]
    );
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        Alert.alert('Deleted', 'Category deleted successfully.');
        loadCategories();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category.');
    }
  };

  // Render each category item
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => setDetailCategory(item)} // Open detail view on press
      activeOpacity={0.8}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {item.note ? <Text style={styles.categoryNote}>{item.note}</Text> : null}
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.editBtn]}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering detail modal
            setCategoryName(item.name);
            setNote(item.note || '');
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
            e.stopPropagation(); // Prevent triggering detail modal
            confirmDelete(item.id, item.name);
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
        style={styles.addCategoryButton}
        onPress={() => {
          clearForm();
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.addCategoryText}>+ New Category</Text>
      </TouchableOpacity>

      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found. Add some!</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal for create/edit */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {currentId ? 'Edit Category' : 'Create Category'}
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Category Name"
              placeholderTextColor="#bbb"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
            />
            <TextInput
              style={[styles.inputField, { height: 80 }]}
              placeholder="Optional note"
              placeholderTextColor="#bbb"
              value={note}
              onChangeText={setNote}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveCategory}
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

      {/* Modal for detailed view */}
      <Modal visible={!!detailCategory} transparent animationType="fade">
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalBox}>
            <Text style={styles.detailTitle}>{detailCategory?.name}</Text>
            {detailCategory?.note ? (
              <Text style={styles.detailNote}>{detailCategory.note}</Text>
            ) : (
              <Text style={styles.detailNote}>(No note provided)</Text>
            )}
            {/* Add more fields here if needed */}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 20 }]}
              onPress={() => setDetailCategory(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
    backgroundColor: '#000000',
    padding: 20,
  },

  addCategoryButton: {
    backgroundColor: '#ff4081',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#ff4081',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 7,
  },

  addCategoryText: {
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

  categoryItem: {
    backgroundColor: '#121212',
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

  categoryName: {
    fontSize: 20,
    color: '#e91e63',
    fontWeight: '800',
  },

  categoryNote: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 4,
    fontStyle: 'italic',
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
    shadowRadius: 4,
  },

  editBtn: {
    backgroundColor: '#d81b60',
  },

    deleteBtn: {
      backgroundColor: '#dc3545',
    },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  modalBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
    elevation: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e91e63',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputField: {
    backgroundColor: '#333',
    color: '#eee',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 14,
    marginHorizontal: 6,
    alignItems: 'center',
  },

  saveButton: {
    backgroundColor: '#e91e63',
    elevation: 8,
  },

  cancelButton: {
    backgroundColor: '#555',
  },

  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  /* New detailed view modal styles */
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  detailModalBox: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },

  detailTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ff4081',
    marginBottom: 12,
    textAlign: 'center',
  },

  detailNote: {
    fontSize: 18,
    color: '#ddd',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
