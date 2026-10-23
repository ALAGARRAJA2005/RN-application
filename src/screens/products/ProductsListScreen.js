import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { ProductCard } from '../../components/ProductCard';
import { AdminProductModal } from '../admin/AdminProductModal';
import { AdminEditPriceModal } from '../admin/AdminEditPriceModal';

export const ProductsListScreen = ({ navigation }) => {
  const {
    currentUser,
    products,
    switchRole,
    cart,
    favorites,
    toggleFavorite,
    addToCart,
    deleteProduct,
  } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const [selectedCategory, setSelectedCategory] = useState('fruits'); // 'fruits' or 'vegetables'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fast lookup maps for zero re-renders of unaffected items
  const cartQtyMap = useMemo(() => {
    const map = {};
    if (cart) {
      cart.forEach(item => {
        if (item?.product?.id) {
          map[item.product.id] = item.quantity;
        }
      });
    }
    return map;
  }, [cart]);

  const favoritesSet = useMemo(() => new Set(favorites || []), [favorites]);

  const handleToggleFavorite = useCallback((id) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
  }, [addToCart]);

  const handleDelete = useCallback((id) => {
    deleteProduct(id);
  }, [deleteProduct]);

  const handleSelectProduct = useCallback((id) => {
    navigation.navigate('ProductDetails', { productId: id });
  }, [navigation]);

  const handleEditPrice = useCallback((product) => {
    setEditingProduct(product);
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Memoized renderItem for 60fps smooth scrolling without re-rendering offscreen cards
  const renderProductItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        inCartQty={cartQtyMap[item.id] || 0}
        isFavorite={favoritesSet.has(item.id)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onDelete={handleDelete}
        onEditPrice={handleEditPrice}
        isAdmin={isAdmin}
        onSelect={handleSelectProduct}
      />
    ),
    [
      cartQtyMap,
      favoritesSet,
      handleToggleFavorite,
      handleAddToCart,
      handleDelete,
      handleEditPrice,
      isAdmin,
      handleSelectProduct,
    ]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamLight} />

      {/* Top Header Matching Figma */}
      <View style={styles.topHeader}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={styles.drawerBtn}
            onPress={() => navigation.openDrawer && navigation.openDrawer()}
          >
            <Ionicons name="menu-outline" size={24} color="#1C1917" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily{"\n"}Grocery Food</Text>
        </View>

        <View style={styles.headerRightActions}>
          {/* Admin Add button if admin */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.adminAddBtn}
              onPress={() => setShowAdminModal(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.adminAddText}>Item</Text>
            </TouchableOpacity>
          )}

          {/* Search circular button from Figma */}
          <TouchableOpacity
            style={styles.searchCircleBtn}
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#1C1917" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar (Toggled) */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedCategory}...`}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Product List with High Performance Smooth Scrolling */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        updateCellsBatchingPeriod={40}
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        overScrollMode="never"
        renderItem={renderProductItem}
        ListHeaderComponent={
          <View>
            {/* Category Pills Matching Figma: Yellow for Fruits, Grey for Vegetables */}
            <View style={styles.categoryPillsRow}>
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  selectedCategory === 'fruits'
                    ? styles.pillActiveYellow
                    : styles.pillInactiveGrey,
                ]}
                onPress={() => {
                  setSelectedCategory('fruits');
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedCategory === 'fruits'
                      ? styles.pillTextYellow
                      : styles.pillTextGrey,
                  ]}
                >
                  Fruits
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  selectedCategory === 'vegetables'
                    ? styles.pillActiveYellow
                    : styles.pillInactiveGrey,
                ]}
                onPress={() => {
                  setSelectedCategory('vegetables');
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedCategory === 'vegetables'
                      ? styles.pillTextYellow
                      : styles.pillTextGrey,
                  ]}
                >
                  Vegetables
                </Text>
              </TouchableOpacity>

              {/* Examiner Role Switcher Quick Pill */}
              <TouchableOpacity
                style={styles.roleSwitchPill}
                onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
              >
                <Text style={styles.roleSwitchText}>
                  {isAdmin ? '👤 Mode: Admin' : '🛒 Mode: Customer'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Subtitle from Figma: "Found more fruits !" or "Found more vegetables !" */}
            <View style={styles.subtitleRow}>
              <Text style={styles.foundText}>
                Found {filteredProducts.length} fresh {selectedCategory} !
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No items found in {selectedCategory}</Text>
          </View>
        }
      />

      {/* Admin Add Product Modal */}
      <AdminProductModal
        visible={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      {/* Admin Edit Rate / Price Modal */}
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
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  drawerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  adminAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  searchCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  categoryPill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  pillActiveYellow: {
    backgroundColor: colors.primary,
  },
  pillInactiveGrey: {
    backgroundColor: colors.inactivePill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pillTextYellow: {
    color: '#FFFFFF',
  },
  pillTextGrey: {
    color: colors.inactivePillText,
  },
  roleSwitchPill: {
    marginLeft: 'auto',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  subtitleRow: {
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  foundText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.2,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
