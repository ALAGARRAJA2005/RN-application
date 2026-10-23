import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const ProductCard = React.memo(({
  product,
  inCartQty: propInCartQty,
  isFavorite: propIsFavorite,
  onToggleFavorite,
  onAddToCart,
  onDelete,
  onEditPrice,
  isAdmin: propIsAdmin,
  onSelect,
}) => {
  const navigation = useNavigation();
  const context = useApp();

  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : context?.currentUser?.role === 'admin';
  const favorite = propIsFavorite !== undefined ? propIsFavorite : context?.isFavorite(product.id);

  const inCartQty = propInCartQty !== undefined ? propInCartQty : (() => {
    const item = context?.cart?.find(c => c.product.id === product.id);
    return item ? item.quantity : 0;
  })();

  const handleToggleFav = () => {
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    } else {
      context?.toggleFavorite(product.id);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      context?.addToCart(product, 1);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    } else {
      context?.deleteProduct(product.id);
    }
  };

  const handleCardPress = () => {
    if (onSelect) {
      onSelect(product.id);
    } else {
      navigation.navigate('ProductDetails', { productId: product.id });
    }
  };

  // --- 3D Animation Values ---
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardTiltX = useRef(new Animated.Value(0)).current;
  const cardTiltY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(cardTiltX, { toValue: 1, useNativeDriver: true }),
      Animated.spring(cardTiltY, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.spring(cardTiltX, { toValue: 0, friction: 3, useNativeDriver: true }),
      Animated.spring(cardTiltY, { toValue: 0, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const rotateX = cardTiltX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '6deg'],
  });

  const rotateY = cardTiltY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-5deg'],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [
            { perspective: 900 },
            { scale: cardScale },
            { rotateX: rotateX },
            { rotateY: rotateY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleCardPress}
        activeOpacity={0.92}
      >
        {/* Top action icons (Favorite for Customer, Edit Price + Delete for Admin) */}
        <View style={styles.topIconRow}>
          {!isAdmin ? (
            <TouchableOpacity
              style={styles.favBtn}
              onPress={handleToggleFav}
              activeOpacity={0.8}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={18}
                color={favorite ? colors.danger : '#9CA3AF'}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.editPriceIconBtn}
                onPress={() => onEditPrice && onEditPrice(product)}
                activeOpacity={0.8}
              >
                <Ionicons name="pricetag-outline" size={14} color="#7C3AED" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, { marginLeft: 6 }]}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={15} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3D Elevated Image Wrap with High-Resolution Presentation */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImg}
            resizeMode="cover"
          />
        </View>

        {/* Title & Price matching Figma */}
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={1}>
            {product.displayName || product.name}
          </Text>
          <Text style={styles.priceText}>{product.unit}</Text>
        </View>

        {/* CUSTOMER ONLY: Add to Cart button */}
        {!isAdmin ? (
          <TouchableOpacity
            style={[
              styles.quickAddBtn,
              inCartQty > 0 && styles.quickAddedBtn,
            ]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons
              name={inCartQty > 0 ? 'checkmark' : 'add'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.quickAddText}>
              {inCartQty > 0 ? `${inCartQty}kg in Cart` : 'Add'}
            </Text>
          </TouchableOpacity>
        ) : (
          /* ADMIN ONLY: Change Rate / Price Button */
          <TouchableOpacity
            style={styles.adminEditRateBtn}
            onPress={() => onEditPrice && onEditPrice(product)}
            activeOpacity={0.85}
          >
            <Ionicons name="pricetag" size={12} color="#FFFFFF" />
            <Text style={styles.adminEditRateText}>Edit Rate</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product?.id === nextProps.product?.id &&
    prevProps.product?.stock === nextProps.product?.stock &&
    prevProps.product?.price === nextProps.product?.price &&
    prevProps.product?.image === nextProps.product?.image &&
    prevProps.inCartQty === nextProps.inCartQty &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.isAdmin === nextProps.isAdmin
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    width: '100%',
  },
  topIconRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 22,
  },
  favBtn: {
    padding: 2,
  },
  deleteBtn: {
    padding: 2,
  },
  imageWrap: {
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 4,
  },
  productImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  infoCol: {
    alignItems: 'center',
    marginTop: 6,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  quickAddBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quickAddedBtn: {
    backgroundColor: colors.primaryDark,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  editPriceIconBtn: {
    padding: 3,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  adminEditRateBtn: {
    marginTop: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  adminEditRateText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
});
