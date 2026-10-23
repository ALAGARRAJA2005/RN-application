import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { AdminEditPriceModal } from '../admin/AdminEditPriceModal';

const { width } = Dimensions.get('window');

export const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params || {};
  const {
    products,
    currentUser,
    isFavorite,
    toggleFavorite,
    addToCart,
    switchRole,
  } = useApp();

  const product = products.find(p => p.id === productId) || products[0];
  const isAdmin = currentUser?.role === 'admin';
  const favorite = isFavorite(product?.id);

  // Stepper quantity (kg) from Figma
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  // --- 3D Animation Values for Hero Product ---
  const rotate3DAnim = useRef(new Animated.Value(0)).current;
  const float3DAnim = useRef(new Animated.Value(0)).current;
  const btn3DAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 3D Turntable Swing Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate3DAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate3DAnim, {
          toValue: -1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate3DAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3D Floating Bobbing Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(float3DAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float3DAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const heroRotateY = rotate3DAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  const heroRotateX = rotate3DAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['6deg', '0deg', '-6deg'],
  });

  const heroTranslateY = float3DAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const heroShadowScale = float3DAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const heroShadowOpacity = float3DAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.12],
  });

  const incrementQty = () => {
    setQuantity(q => q + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isAdmin) return;
    Animated.sequence([
      Animated.timing(btn3DAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(btn3DAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    addToCart(product, quantity);
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="never"
      >
        {/* Top Header Matching Figma iPhone 14 Pro - 5 & 6 */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#1C1917" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Details</Text>

          {!isAdmin ? (
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => toggleFavorite(product.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? '#EF4444' : '#6B7280'}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => setShowPriceModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="pricetag-outline" size={19} color="#7C3AED" />
            </TouchableOpacity>
          )}
        </View>

        {/* 3D Hero Product Showcase with High-Resolution Rendering */}
        <View style={styles.heroWrap}>
          <Animated.View
            style={[
              styles.threeDHeroCard,
              {
                transform: [
                  { perspective: 900 },
                  { translateY: heroTranslateY },
                  { rotateY: heroRotateY },
                  { rotateX: heroRotateX },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.heroImg}
              resizeMode="cover"
            />
          </Animated.View>

          {/* 3D Cast Shadow */}
          <Animated.View
            style={[
              styles.heroGroundShadow,
              {
                transform: [{ scaleX: heroShadowScale }, { scaleY: heroShadowScale }],
                opacity: heroShadowOpacity,
              },
            ]}
          />

          {/* Dots pagination indicator matching Figma: [• • •] */}
          <View style={styles.dotsRow}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
          </View>
        </View>

        {/* White Rounded Container Sheet */}
        <View style={styles.sheetCard}>
          {/* Title Row with Stepper */}
          <View style={styles.titleAndStepperRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.productTitle}>
                {product.displayName || product.name}
              </Text>

              {/* 5 Golden Stars from Figma */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Ionicons key={star} name="star" size={14} color="#F59E0B" style={{ marginRight: 2 }} />
                ))}
              </View>
            </View>

            {/* Stepper matching Figma: [- 1kg +] (Only Customer needs qty counter) */}
            {!isAdmin ? (
              <View style={styles.stepperPill}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={decrementQty}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#1C1917" />
                </TouchableOpacity>

                <Text style={styles.stepperValue}>{quantity}kg</Text>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={incrementQty}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#1C1917" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.adminBadge}
                onPress={() => setShowPriceModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={13} color="#7C3AED" />
                <Text style={styles.adminBadgeText}>In Stock: {product.stock}kg</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section from Figma */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descText}>
              {showFullDesc
                ? product.description
                : `${product.description?.substring(0, 110)}... `}
              <Text
                style={styles.seeMoreText}
                onPress={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? 'See less' : 'See more'}
              </Text>
            </Text>
          </View>

          {/* Related Items Section from Figma */}
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Related Items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
              scrollEventThrottle={16}
              bounces={true}
              overScrollMode="never"
            >
              {product.related?.map((item, idx) => {
                const targetProd = products.find(
                  p =>
                    p.displayName?.toLowerCase() === item.name?.toLowerCase() ||
                    p.name?.toLowerCase().includes(item.name?.toLowerCase())
                );
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.relatedCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (targetProd) {
                        navigation.push('ProductDetails', { productId: targetProd.id });
                      }
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.relatedImg}
                      resizeMode="cover"
                    />
                    <Text style={styles.relatedName} numberOfLines={1}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar: Customer gets Add to Cart, Admin gets info */}
      <View style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>Rs {product.price}/kg</Text>
        </View>

        {/* CUSTOMER ONLY: Add to Cart >>> Pill Button */}
        {!isAdmin ? (
          <Animated.View style={{ transform: [{ scale: btn3DAnim }] }}>
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <Text style={styles.addToCartText}>Add to Cart &gt;&gt;&gt;</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* ADMIN ONLY: Change Rate / Price action button */
          <TouchableOpacity
            style={styles.adminChangeRateBtn}
            onPress={() => setShowPriceModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="pricetag" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.adminChangeRateBtnText}>Change Rate / Price</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Admin Edit Rate & Price Modal */}
      {isAdmin && (
        <AdminEditPriceModal
          visible={showPriceModal}
          product={product}
          onClose={() => setShowPriceModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamLight,
  },
  scroll: {
    paddingBottom: 110,
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
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  threeDHeroCard: {
    zIndex: 2,
  },
  heroImg: {
    width: width * 0.72,
    height: 210,
    borderRadius: 24,
  },
  heroGroundShadow: {
    width: width * 0.45,
    height: 14,
    borderRadius: 40,
    backgroundColor: '#000000',
    marginTop: -8,
    zIndex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 4,
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 22,
    minHeight: 340,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  titleAndStepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 6,
    height: 38,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    paddingHorizontal: 8,
  },
  adminBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminBadgeText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  descSection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  descText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  seeMoreText: {
    fontWeight: '800',
    color: colors.primary,
  },
  relatedSection: {
    marginTop: 18,
  },
  relatedScroll: {
    paddingVertical: 8,
  },
  relatedCard: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 4,
  },
  relatedImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  relatedName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  priceCol: {},
  priceLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  addToCartBtn: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  adminBottomNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  adminBottomNoticeText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  adminChangeRateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  adminChangeRateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
