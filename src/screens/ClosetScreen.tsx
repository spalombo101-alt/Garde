import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useClosetStore } from '@stores/closetStore';
import { useAuthStore } from '@stores/authStore';
import { ClothingItem } from '@types/index';

type Category = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
const CATEGORIES: Category[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];

export default function ClosetScreen() {
  const user = useAuthStore((s) => s.user);
  const { items, isLoading, fetchUserCloset, addClothingItem, deleteClothingItem } =
    useClosetStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('tops');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserCloset(user.id);
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddItem = async () => {
    if (!imageUri) {
      Alert.alert('Please select an image');
      return;
    }

    try {
      await addClothingItem({
        userId: user!.id,
        imageUri,
        brand: brand || undefined,
        category,
        color: color || undefined,
        size: size || undefined,
        notes: notes || undefined,
      });

      // Reset form
      setImageUri('');
      setBrand('');
      setCategory('tops');
      setColor('');
      setSize('');
      setNotes('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Failed to add item');
    }
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onLongPress={() => {
        Alert.alert('Delete item?', 'This action cannot be undone', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteClothingItem(item.id),
          },
        ]);
      }}
    >
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
      <Text style={styles.itemCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderClothingItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your closet is empty</Text>
            <Text style={styles.emptySubtext}>Add your first item to get started!</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={handleAddItem}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <TouchableOpacity style={styles.imagePickButton} onPress={pickImage}>
              <Text style={styles.imagePickButtonText}>
                {imageUri ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Zara, H&M, Thrifted"
              value={brand}
              onChangeText={setBrand}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Black, Navy Blue"
              value={color}
              onChangeText={setColor}
            />

            <Text style={styles.label}>Size</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., S, M, L, 32"
              value={size}
              onChangeText={setSize}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Perfect for summer, lightly worn, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  itemBrand: {
    paddingHorizontal: 8,
    paddingTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  itemCategory: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    fontSize: 11,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseText: {
    color: '#999',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSaveText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  imagePickButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePickButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
});
