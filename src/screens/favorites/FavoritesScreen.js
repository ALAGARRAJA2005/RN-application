import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { ProductCard } from '../../components/ProductCard';

export const FavoritesScreen = ({ navigation }) => {
  const {
    currentUser,
    products,
    favorites,
    cart,
    toggleFavorite,
    addToCart,
    deleteProduct,
    addAllFavoritesToCart,
    switchRole,
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

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

  // Get favorite products
  const favoriteProducts = useMemo(() => {
    return products.filter(p => favorites.includes(p.id));
  }, [products, favorites]);

  const handleOptionsPress = () => {
    Alert.alert(
      'Favourite Options',
      'What would you like to do?',
      [
        { text: 'Add All to Cart', onPress: addAllFavoritesToCart },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderProductItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        inCartQty={cartQtyMap[item.id] || 0}
        isFavorite={favoritesSet.has(item.id)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onDelete={handleDelete}
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
      isAdmin,
      handleSelectProduct,
    ]
  );

  return (
    <View style={styles.container}>
      {/* Top Header Matching Figma iPhone 14 Pro - 4 */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#1C1917" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Favourite</Text>

        <TouchableOpacity
          style={styles.circleOptionsBtn}
          onPress={handleOptionsPress}
          activeOpacity={0.8}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#1C1917" />
        </TouchableOpacity>
      </View>

      {/* Admin Notice if in Admin Mode */}
      {isAdmin && (
        <View style={styles.adminBanner}>
          <Text style={styles.adminBannerText}>
            Note: Favourite Screen is Customer-exclusive. Currently previewing in Admin mode.
          </Text>
          <TouchableOpacity
            style={styles.switchTinyBtn}
            onPress={() => switchRole('customer')}
          >
            <Text style={styles.switchTinyText}>Switch to Customer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Grid of Favorite items with Smooth Scrolling */}
      <FlatList
        data={favoriteProducts}
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
          favoriteProducts.length > 0 ? (
            <View style={styles.subBar}>
              <Text style={styles.subText}>
                {favoriteProducts.length} favourite food items
              </Text>
              <TouchableOpacity
                style={styles.addAllAction}
                onPress={addAllFavoritesToCart}
              >
                <Ionicons name="cart" size={14} color={colors.primary} />
                <Text style={styles.addAllActionText}>Add All to Cart</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={54} color="#EF4444" />
            <Text style={styles.emptyTitle}>No Favourites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any fruit or vegetable to save it here.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('ProductsTab')}
            >
              <Text style={styles.browseBtnText}>Browse Daily Groceries</Text>
            </TouchableOpacity>
          </View>
        }
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
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBackBtn: {
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
    letterSpacing: -0.3,
  },
  circleOptionsBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  adminBanner: {
    backgroundColor: '#EDE9FE',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminBannerText: {
    fontSize: 11,
    color: '#7C3AED',
    flex: 1,
    marginRight: 6,
  },
  switchTinyBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  switchTinyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  subBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  subText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  addAllAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addAllActionText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
