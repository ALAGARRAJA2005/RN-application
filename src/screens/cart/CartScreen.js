import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const CartScreen = ({ navigation }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    currentUser,
    switchRole,
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Requirement: "admin la cart vara kudathu only costomer tha"
  if (isAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="lock-closed" size={44} color="#7C3AED" />
          </View>
          <Text style={styles.restrictedTitle}>Cart Access Restricted</Text>
          <Text style={styles.restrictedSubtitle}>
            Cart & Checkout are strictly available for Customer users only. Admins have inventory and product management access.
          </Text>
          <TouchableOpacity
            style={styles.switchCustBtn}
            onPress={() => switchRole('customer')}
            activeOpacity={0.85}
          >
            <Ionicons name="person" size={16} color="#FFFFFF" />
            <Text style={styles.switchCustBtnText}>Switch to Customer Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backStoreBtn}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Text style={styles.backStoreText}>← Back to Grocery Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Requirement Part III (iii): Add or Subtract items in cart screen
  const handleSubtract = (productId, currentQuantity, productName) => {
    if (currentQuantity === 1) {
      Alert.alert(
        'Remove Item',
        `Do you want to remove "${productName}" from your cart?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => updateCartQuantity(productId, -1),
          },
        ]
      );
    } else {
      updateCartQuantity(productId, -1);
    }
  };

  const handleAdd = (productId) => {
    updateCartQuantity(productId, 1);
  };

  const handleBookNow = () => {
    if (cart.length === 0) return;
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setShowOrderModal(true);
  };

  const handleFinish = () => {
    setShowOrderModal(false);
    clearCart();
    navigation.navigate('ProductsTab');
  };

  return (
    <View style={styles.container}>
      {/* Top Header Matching Figma iPhone 14 Pro - 7 */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#1C1917" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => Alert.alert('Cart Search', 'Search items in your grocery basket')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={18} color="#1C1917" />
        </TouchableOpacity>
      </View>

      {/* Cart Items List with Smooth Scrolling */}
      <FlatList
        data={cart}
        keyExtractor={item => item.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        overScrollMode="never"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        renderItem={({ item }) => {
          const { product, quantity } = item;
          const categorySubtitle =
            product.category === 'fruits' ? 'Fresh fruits' : 'Fresh vegetable';

          return (
            <View style={styles.cartCard}>
              {/* Product Thumbnail with High Quality Presentation */}
              <View style={styles.imgWrapper}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.cartImg}
                  resizeMode="cover"
                />
              </View>

              {/* Title, Subtitle, Price */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{product.displayName || product.name}</Text>
                <Text style={styles.itemSubtitle}>{categorySubtitle}</Text>
                <Text style={styles.itemPrice}>Rs {product.price}/kg</Text>
              </View>

              {/* Vertical Stepper Matching Figma: [+ / qty / -] */}
              <View style={styles.verticalStepper}>
                <TouchableOpacity
                  style={styles.stepperAction}
                  onPress={() => handleAdd(product.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#1C1917" />
                </TouchableOpacity>

                <Text style={styles.stepperCount}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.stepperAction}
                  onPress={() => handleSubtract(product.id, quantity, product.displayName || product.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#1C1917" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Add fruits and vegetables from the Daily Grocery store.
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('ProductsTab')}
            >
              <Text style={styles.shopBtnText}>Shop Groceries</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Bottom Sticky Total & "Book Now >>>" Matching Figma */}
      {cart.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs {cartTotal}</Text>
          </View>

          {/* Yellow pill button "Book Now >>>" from Figma */}
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={handleBookNow}
            activeOpacity={0.85}
          >
            <Text style={styles.bookNowText}>Book Now &gt;&gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order Success Modal */}
      <Modal visible={showOrderModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={38} color={colors.primary} />
            </View>

            <Text style={styles.modalTitle}>Order Confirmed! 🎉</Text>
            <Text style={styles.modalOrderId}>Order ID: #{orderId}</Text>

            <View style={styles.receiptBox}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Total Amount:</Text>
                <Text style={styles.receiptVal}>Rs {cartTotal}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Estimated Delivery:</Text>
                <Text style={styles.receiptVal}>Within 30 Mins</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment:</Text>
                <Text style={styles.receiptVal}>Cash on Delivery</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Delivery Address:</Text>
                <Text style={styles.receiptVal}>
                  {currentUser?.address?.split(',')[0] || 'Default Address'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamLight,
  },
  restrictedContainer: {
    flex: 1,
    backgroundColor: colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  restrictedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  restrictedIconBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
  },
  restrictedSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  switchCustBtn: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 20,
    width: '100%',
  },
  switchCustBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  backStoreBtn: {
    marginTop: 14,
  },
  backStoreText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
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
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 150,
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imgWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cartImg: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 4,
  },
  verticalStepper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stepperAction: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    marginVertical: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
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
    marginTop: 4,
  },
  shopBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 16,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  modalOrderId: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  receiptBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginVertical: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  continueBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
