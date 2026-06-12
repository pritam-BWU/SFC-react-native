import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BadgeCheck, Dumbbell, ShieldCheck, Truck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import {
  allDatasetProducts,
  DatasetProduct,
  productCategories,
} from '../../../data/productDataset';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';
const PRODUCT_WIDTH = Math.min(142, width * 0.37);
const HERO_WIDTH = width - 36;

const ICONS = {
  heart: '\u2764\uFE0F',
  heartEmpty: '\u2661',
  right: '\u203A',
};

type ProductDetailId = RootStackParamList['ProductDetail']['productId'];
type IconComponent = typeof BadgeCheck;

type WhyItem = {
  id: string;
  title: string;
  sub: string;
  icon: IconComponent;
};

const whyItems: WhyItem[] = [
  { id: 'fresh', title: '100% Fresh', sub: 'Daily checked', icon: BadgeCheck },
  {
    id: 'nutrition',
    title: 'High Protein',
    sub: 'Smart nutrition',
    icon: Dumbbell,
  },
  {
    id: 'quality',
    title: 'Quality Assured',
    sub: 'Hygienic process',
    icon: ShieldCheck,
  },
  { id: 'delivery', title: 'On-Time', sub: 'Fast delivery', icon: Truck },
];

const SectionHeader = ({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.viewAllRow}
      onPress={onViewAll}
    >
      <Text style={styles.viewAllText}>View All</Text>
      <Text style={styles.viewAllIcon}>{ICONS.right}</Text>
    </TouchableOpacity>
  </View>
);

const getDiscount = (index: number) =>
  [`Up to 20% off`, `Up to 30% off`, `Up to 40% off`][index % 3];

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const bannerRef = useRef<ScrollView>(null);
  const heroScrollX = useRef(new Animated.Value(0)).current;

  const bannerSlides = useMemo(
    () =>
      [
        {
          id: 'fresh',
          eyebrow: 'Fresh Selection',
          title: 'Everyday Fresh Picks',
          subtitle: 'Quality food, simple choices',
          description:
            'Browse chicken, paneer, soya and ready-to-cook favorites prepared for your daily meals.',
          image: productCategories[0]?.products[0]?.image,
        },
        {
          id: 'member',
          eyebrow: 'Foodclub Member',
          title: 'Better Access Ahead',
          subtitle: 'Exclusive member-oriented benefits',
          description:
            'Become ready for selected pricing benefits and priority access when ordering starts.',
          image: productCategories[1]?.products[0]?.image,
        },
        {
          id: 'quality',
          eyebrow: 'Reliable Source',
          title: 'Freshness You Can Trust',
          subtitle: 'Hygiene-focused sourcing',
          description:
            'Explore carefully sourced products from reliable farms and clean handling processes.',
          image: productCategories[2]?.products[0]?.image,
        },
      ],
    [],
  );

  const goToBanner = (index: number) => {
    bannerRef.current?.scrollTo({ x: index * HERO_WIDTH, animated: true });
    setBannerIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(current => {
        const next = bannerSlides.length ? (current + 1) % bannerSlides.length : 0;
        bannerRef.current?.scrollTo({ x: next * HERO_WIDTH, animated: true });
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const toggleWishlist = (id: string) => {
    setWishlist(current =>
      current.includes(id)
        ? current.filter(productId => productId !== id)
        : [...current, id],
    );
  };

  const openDetail = (productId: ProductDetailId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const openSearchResults = (query: string) => {
    navigation.navigate('SearchResults', { query });
  };

  const openCategory = (categoryId?: string) => {
    navigation.navigate('Categories', categoryId ? { categoryId } : undefined);
  };

  const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / HERO_WIDTH);
    setBannerIndex(nextIndex);
  };

  const renderProductCard = (product: DatasetProduct, index: number) => (
    <TouchableOpacity
      key={product.id}
      activeOpacity={0.86}
      style={styles.productCard}
      onPress={() => openDetail(product.id)}
    >
      <View style={styles.productImageWrap}>
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{getDiscount(index)}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.heartButton}
          onPress={event => {
            event.stopPropagation();
            toggleWishlist(product.id);
          }}
        >
          <Text
            style={[
              styles.heartIcon,
              wishlist.includes(product.id) && styles.heartActive,
            ]}
          >
            {wishlist.includes(product.id) ? ICONS.heart : ICONS.heartEmpty}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productBody}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice} numberOfLines={1}>
          {product.priceStartingFrom}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductSection = (
    title: string,
    products: DatasetProduct[],
    key: string,
    categoryId?: string,
  ) => (
    <View key={key} style={styles.productSection}>
      <SectionHeader title={title} onViewAll={() => openCategory(categoryId)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsRail}
      >
        {products.slice(0, 5).map(renderProductCard)}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <View style={styles.fixedTopArea}>
        <FoodClubHeader showSearch onSearch={openSearchResults} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Animated.ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            bounces={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: heroScrollX } } }],
              { useNativeDriver: true },
            )}
            onMomentumScrollEnd={handleBannerScroll}
          >
            {bannerSlides.map((slide, index) => {
              const inputRange = [
                (index - 1) * HERO_WIDTH,
                index * HERO_WIDTH,
                (index + 1) * HERO_WIDTH,
              ];
              const slideScale = heroScrollX.interpolate({
                inputRange,
                outputRange: [0.94, 1, 0.94],
                extrapolate: 'clamp',
              });
              const slideOpacity = heroScrollX.interpolate({
                inputRange,
                outputRange: [0.78, 1, 0.78],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={slide.id}
                  style={[
                    styles.heroSlide,
                    {
                      opacity: slideOpacity,
                      transform: [{ scale: slideScale }],
                    },
                  ]}
                >
                  <View style={styles.heroAccent} />
                  <View style={styles.heroCopy}>
                    <Text style={styles.heroEyebrow}>{slide.eyebrow}</Text>
                    <Text style={styles.heroTitle} numberOfLines={2}>
                      {slide.title}
                    </Text>
                    <Text style={styles.heroTitleRed} numberOfLines={1}>
                      {slide.subtitle}
                    </Text>
                    <Text style={styles.heroText} numberOfLines={3}>
                      {slide.description}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.heroButton}
                      onPress={() => openCategory()}
                    >
                      <Text style={styles.heroButtonText}>Explore More</Text>
                      <Text style={styles.heroButtonArrow}>{ICONS.right}</Text>
                    </TouchableOpacity>
                  </View>
                  {slide.image && (
                    <View style={styles.heroImagePanel}>
                      <Image
                        source={slide.image}
                        style={styles.heroImage}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        </View>

        <View style={styles.dotsRow}>
          {bannerSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => goToBanner(index)}
              style={[styles.dot, index === bannerIndex && styles.dotActive]}
            />
          ))}
        </View>

        <SectionHeader title="Shop By Category" onViewAll={() => openCategory()} />
        <View style={styles.categoriesPanel}>
          {productCategories.map(category => {
            const firstProduct = category.products[0];

            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                onPress={() => openCategory(category.id)}
                style={styles.categoryItem}
              >
                <View style={styles.categoryIconCircle}>
                  {firstProduct && (
                    <Image
                      source={firstProduct.image}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2}>
                  {category.name.replace('Organic Country ', '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.whyPanel}>
          <Text style={styles.whyHeading}>Why Choose Superfowl Food Club?</Text>
          <View style={styles.whyRow}>
            {whyItems.map(item => {
              const WhyIcon = item.icon;

              return (
                <View key={item.id} style={styles.whyItem}>
                  <View style={styles.whyIconCircle}>
                    <WhyIcon size={22} color={RED} strokeWidth={2.3} />
                  </View>
                  <Text style={styles.whyTitle}>{item.title}</Text>
                  <Text style={styles.whySub}>{item.sub}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {renderProductSection('Top Picks for You', allDatasetProducts.slice(0, 5), 'top')}
        <View style={styles.foodclubCard}>
          <View style={styles.foodclubIconCircle}>
            <Icon name="crown-outline" color={RED} size={30} />
          </View>
          <View style={styles.foodclubCopy}>
            <Text style={styles.foodclubTitle}>
              Join Superfowl Foodclub Membership
            </Text>
            <Text style={styles.foodclubText}>
              Become our foodclub member and enjoy exclusive pricing and priority
              access when ordering starts.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.foodclubButton}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.foodclubButtonText}>View Plans</Text>
          </TouchableOpacity>
        </View>
        {productCategories.map(category =>
          renderProductSection(
            category.name,
            category.products,
            category.id,
            category.id,
          ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_YELLOW,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 84,
    backgroundColor: '#FFFFFF',
  },
  fixedTopArea: {
    backgroundColor: PAGE_YELLOW,
    borderBottomWidth: 1,
    borderBottomColor: '#F4DF8F',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  heroCard: {
    minHeight: 188,
    height: 218,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: '#FFF8D9',
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: RED,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  heroSlide: {
    width: HERO_WIDTH,
    flexDirection: 'row',
    position: 'relative',
  },
  heroAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: RED,
  },
  heroCopy: {
    flex: 1,
    padding: 18,
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 18,
    justifyContent: 'center',
  },
  heroEyebrow: {
    alignSelf: 'flex-start',
    color: RED,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  heroTitle: {
    color: DARK,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
  },
  heroTitleRed: {
    color: RED,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 3,
  },
  heroText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  heroButtonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
    marginTop: -1,
  },
  heroImagePanel: {
    width: width * 0.38,
    height: '100%',
    padding: 10,
    paddingLeft: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F2DFA0',
  },
  dotActive: {
    width: 24,
    backgroundColor: RED,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  viewAllIcon: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 2,
  },
  categoriesPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  categoryItem: {
    width: (width - 76) / 4,
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '900',
    lineHeight: 13,
    minHeight: 28,
    textAlign: 'center',
  },
  whyPanel: {
    marginHorizontal: 18,
    marginBottom: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    paddingVertical: 16,
  },
  whyHeading: {
    color: RED,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  whyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  whyItem: {
    width: '24%',
    alignItems: 'center',
  },
  whyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#F3D36A',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  whyTitle: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '900',
    textAlign: 'center',
  },
  whySub: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center',
    marginTop: 3,
  },
  productSection: {
    marginBottom: 16,
  },
  productsRail: {
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: 2,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    minHeight: 176,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productImageWrap: {
    height: 92,
    position: 'relative',
    backgroundColor: '#FFFDF3',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 9,
    left: 8,
    borderRadius: 12,
    backgroundColor: RED,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    color: DARK,
    fontSize: 15,
    lineHeight: 16,
  },
  heartActive: {
    color: RED,
  },
  productBody: {
    padding: 8,
  },
  productName: {
    color: DARK,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '900',
    minHeight: 30,
  },
  productCategory: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  productPrice: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 6,
  },
  foodclubCard: {
    minHeight: 108,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 14,
    gap: 12,
  },
  foodclubCopy: {
    flex: 1,
  },
  foodclubIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodclubTitle: {
    color: DARK,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  foodclubText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  foodclubButton: {
    borderRadius: 9,
    backgroundColor: RED,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  foodclubButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});

export default HomeScreen;
