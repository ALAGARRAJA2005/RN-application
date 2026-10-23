import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const AdminEditPriceModal = ({ visible, onClose, product }) => {
  const { updateProductPrice } = useApp();

  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setPrice(product.price ? product.price.toString() : '');
      setStock(product.stock !== undefined ? product.stock.toString() : '');
      setError('');
    }
  }, [product, visible]);

  if (!product) return null;

  const currentPriceNum = parseFloat(product.price) || 0;
  const newPriceNum = parseFloat(price) || 0;
  const priceDiff = newPriceNum - currentPriceNum;

  const handleAdjustPrice = (amount) => {
    const nextVal = Math.max(1, (parseFloat(price) || currentPriceNum) + amount);
    setPrice(nextVal.toString());
    setError('');
  };

  const handleAdjustStock = (amount) => {
    const nextVal = Math.max(0, (parseInt(stock, 10) || product.stock || 0) + amount);
    setStock(nextVal.toString());
  };

  const handleSave = () => {
    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid positive price in Rs (e.g. 65)');
      return;
    }

    const numStock = stock ? parseInt(stock, 10) : product.stock;
    const success = updateProductPrice(product.id, numPrice, numStock);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.avoidWrap}
          >
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.titleRow}>
                  <View style={styles.adminIconCircle}>
                    <Ionicons name="pricetag" size={18} color="#7C3AED" />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.headerTitle}>Change Rate / Price</Text>
                    <Text style={styles.headerSubtitle}>Admin Rate Controller</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Product Preview Bar */}
              <View style={styles.productBanner}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productThumb}
                  resizeMode="cover"
                />
                <View style={styles.productMeta}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.displayName || product.name}
                  </Text>
                  <Text style={styles.categoryBadgeText}>
                    {product.category?.toUpperCase()}
                  </Text>
                  <View style={styles.currentPriceRow}>
                    <Text style={styles.currentPriceLabel}>Current Rate: </Text>
                    <Text style={styles.currentPriceVal}>Rs {product.price}/kg</Text>
                  </View>
                </View>
              </View>

              {/* Price / Rate Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.sectionLabel}>New Rate (Rs per kg) *</Text>
                
                <View style={[styles.inputBox, error && styles.inputBoxError]}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter new rate..."
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={(val) => {
                      setPrice(val);
                      setError('');
                    }}
                    autoFocus
                  />
                  <Text style={styles.unitSuffix}>/ kg</Text>
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Quick Price Adjust Buttons */}
                <View style={styles.quickPillsRow}>
                  <Text style={styles.quickLabel}>Quick Adjust:</Text>
                  <TouchableOpacity
                    style={styles.quickPill}
                    onPress={() => handleAdjustPrice(-10)}
                  >
                    <Text style={styles.quickPillText}>- ₹10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickPill}
                    onPress={() => handleAdjustPrice(-5)}
                  >
                    <Text style={styles.quickPillText}>- ₹5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPill, styles.quickPillPositive]}
                    onPress={() => handleAdjustPrice(5)}
                  >
                    <Text style={[styles.quickPillText, styles.quickPillTextPositive]}>+ ₹5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPill, styles.quickPillPositive]}
                    onPress={() => handleAdjustPrice(10)}
                  >
                    <Text style={[styles.quickPillText, styles.quickPillTextPositive]}>+ ₹10</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Stock Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.sectionLabel}>Stock Quantity (kg)</Text>
                
                <View style={styles.inputBox}>
                  <Ionicons name="cube-outline" size={18} color="#7C3AED" style={{ marginRight: 6 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter stock..."
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                  />
                  <Text style={styles.unitSuffix}>kg in store</Text>
                </View>

                {/* Quick Stock Adjust Buttons */}
                <View style={styles.quickPillsRow}>
                  <Text style={styles.quickLabel}>Quick Stock:</Text>
                  <TouchableOpacity
                    style={styles.quickPill}
                    onPress={() => handleAdjustStock(-10)}
                  >
                    <Text style={styles.quickPillText}>- 10kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickPill}
                    onPress={() => handleAdjustStock(10)}
                  >
                    <Text style={styles.quickPillText}>+ 10kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickPill}
                    onPress={() => handleAdjustStock(25)}
                  >
                    <Text style={styles.quickPillText}>+ 25kg</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Change Summary Indicator */}
              {newPriceNum > 0 && newPriceNum !== currentPriceNum && (
                <View style={styles.diffBox}>
                  <Ionicons
                    name={priceDiff > 0 ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={priceDiff > 0 ? '#DC2626' : '#16A34A'}
                  />
                  <Text style={styles.diffText}>
                    Price will change from{' '}
                    <Text style={{ fontWeight: '700' }}>Rs {currentPriceNum}</Text> to{' '}
                    <Text style={{ fontWeight: '800', color: '#7C3AED' }}>Rs {newPriceNum}/kg</Text>{' '}
                    ({priceDiff > 0 ? `+Rs ${priceDiff}` : `-Rs ${Math.abs(priceDiff)}`})
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>Save Rate & Price</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  avoidWrap: {
    width: '100%',
    maxWidth: 440,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#012D54',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FC',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4E5F5',
  },
  productThumb: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  productMeta: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#012D54',
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#3F678E',
    fontWeight: '700',
    marginTop: 1,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  currentPriceLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  currentPriceVal: {
    fontSize: 12,
    color: '#0F4A82',
    fontWeight: '800',
  },
  inputSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    height: '100%',
  },
  unitSuffix: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },
  quickPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  quickLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginRight: 6,
  },
  quickPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickPillPositive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  quickPillTextPositive: {
    color: '#7C3AED',
  },
  diffBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  diffText: {
    fontSize: 12,
    color: '#334155',
    marginLeft: 6,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
