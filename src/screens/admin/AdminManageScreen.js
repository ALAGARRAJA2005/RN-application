import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { AdminProductModal } from './AdminProductModal';
import { AdminEditPriceModal } from './AdminEditPriceModal';

export const AdminManageScreen = ({ navigation }) => {
  const { products, deleteProduct } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.openDrawer && navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={22} color="#1C1917" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Store Inventory (Admin)</Text>

        <TouchableOpacity
          style={styles.addCircleBtn}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.adminBanner}>
        <Ionicons name="shield-checkmark" size={20} color="#7C3AED" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.bannerTitle}>Admin Rate & Stock Control</Text>
          <Text style={styles.bannerSubtitle}>
            Tap "Edit Rate" on any item to update rates/prices in real-time.
          </Text>
        </View>
      </View>

      {/* Products Stock List */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.inventoryCard}>
            <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="cover" />

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.displayName || item.name}</Text>
              <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
              <Text style={styles.itemPrice}>Rs {item.price}/kg</Text>
              <Text style={styles.itemStock}>In Stock: {item.stock}kg</Text>
            </View>

            <View style={styles.actionsCol}>
              <TouchableOpacity
                style={styles.editRateBtn}
                onPress={() => setEditingProduct(item)}
                activeOpacity={0.8}
              >
                <Ionicons name="pricetag" size={13} color="#FFFFFF" />
                <Text style={styles.editRateBtnText}>Edit Rate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteProduct(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add New Product Modal */}
      <AdminProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Rate / Price Modal */}
      <AdminEditPriceModal
        visible={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamLight,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  addCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  adminBanner: {
    backgroundColor: '#EDE9FE',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C3AED',
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inventoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  itemImg: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  itemCategory: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  itemStock: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 1,
  },
  actionsCol: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  editRateBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  editRateBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
