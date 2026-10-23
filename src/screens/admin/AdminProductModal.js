import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const AdminProductModal = ({ visible, onClose }) => {
  const { addProduct } = useApp();

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('fruits');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Product name must be at least 3 characters';
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      errs.price = 'Enter a valid price in Rs (e.g. 60)';
    }
    if (!stock.trim() || isNaN(stock) || parseInt(stock, 10) < 0) {
      errs.stock = 'Enter valid stock count';
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newProduct = {
      name: name.trim(),
      displayName: displayName.trim() || name.trim(),
      category,
      price: parseFloat(price),
      unit: `Rs ${parseFloat(price)}/kg`,
      unitWeight: '1kg',
      stock: parseInt(stock, 10),
      description: description.trim(),
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85',
    };

    addProduct(newProduct);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDisplayName('');
    setCategory('fruits');
    setPrice('');
    setStock('25');
    setDescription('');
    setImageUrl('');
    setErrors({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.adminIconBox}>
                <Ionicons name="add-circle" size={20} color="#7C3AED" />
              </View>
              <Text style={styles.headerTitle}>Add New Grocery Item (Admin)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. Fresh Red Apple"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Display Short Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Label (Short)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Apple"
                placeholderTextColor="#9CA3AF"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Category Selector: Fruits vs Vegetables */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.catRow}>
                <TouchableOpacity
                  style={[styles.catBtn, category === 'fruits' && styles.catBtnActiveYellow]}
                  onPress={() => setCategory('fruits')}
                >
                  <Text style={[styles.catBtnText, category === 'fruits' && styles.catBtnTextActive]}>
                    Fruits
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.catBtn, category === 'vegetables' && styles.catBtnActiveYellow]}
                  onPress={() => setCategory('vegetables')}
                >
                  <Text style={[styles.catBtnText, category === 'vegetables' && styles.catBtnTextActive]}>
                    Vegetables
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price (Rs/kg) & Stock */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price (Rs per kg) *</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="e.g. 80"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Stock (kg) *</Text>
                <TextInput
                  style={[styles.input, errors.stock && styles.inputError]}
                  placeholder="25"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                />
                {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
              </View>
            </View>

            {/* Image URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cutout Image URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://... (Leave blank for default image)"
                placeholderTextColor="#9CA3AF"
                value={imageUrl}
                onChangeText={setImageUrl}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                placeholder="Health benefits, vitamins, and energy details..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveBtnText}>Save Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    height: 46,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
  },
  textArea: {
    minHeight: 70,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.text,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  catRow: {
    flexDirection: 'row',
  },
  catBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  catBtnActiveYellow: {
    backgroundColor: colors.primary,
  },
  catBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  catBtnTextActive: {
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
