import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
const PRODUCT_WIDTH = Math.min(160, width * 0.42);

const ICONS = {
  shield: '\u{1F6E1}\uFE0F',
  leaf: '\u{1F331}',
  truck: '\u{1F69A}',
  check: '\u2713',
  heart: '\u2764\uFE0F',
  heartEmpty: '\u2661',
  right: '\u203A',
};

type ProductDetailId = RootStackParamList['ProductDetail']['productId'];

type WhyItem = {
  id: string;
  title: string;
  sub: string;
  icon: string;
};

const whyItems: WhyItem[] = [
  { id: 'fresh', title: '100% Fresh', sub: 'Daily checked', icon: ICONS.check },
  {
    id: 'nutrition',
    title: 'High Protein',
    sub: 'Smart nutrition',
    icon: ICONS.leaf,
  },
  {
    id: 'quality',
    title: 'Quality Assured',
    sub: 'Hygienic process',
    icon: ICONS.shield,
  },
  { id: 'delivery', title: 'On-Time', sub: 'Fast delivery', icon: ICONS.truck },
];

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity activeOpacity={0.75} style={styles.viewAllRow}>
      <Text style={styles.viewAllText}>View All</Text>
      <Text style={styles.viewAllIcon}>{ICONS.right}</Text>
    </TouchableOpacity>
  </View>
);

const getDiscount = (index: number) => ['20% OFF', '15% OFF', '10% OFF'][index % 3];

const getBannerDescription = (product: DatasetProduct) => {
  const firstSentence = product.overview.split('.')[0];

  return firstSentence
    ? `${firstSentence}.`
    : 'Fresh food choices prepared for everyday meals.';
};

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const bannerSlides = useMemo(
    () =>
      productCategories
        .flatMap(category => category.products.slice(0, 1))
        .map(product => ({
          product,
          eyebrow: product.category.replace('Organic Country ', ''),
          title: product.name,
          subtitle: product.highlightTitles[0] || 'Fresh Food Selection',
          description: getBannerDescription(product),
        })),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(current =>
        bannerSlides.length ? (current + 1) % bannerSlides.length : 0,
      );
    }, 2500);

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
        <Text style={styles.productCategory} numberOfLines={1}>
          {product.category}
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
  ) => (
    <View key={key} style={styles.productSection}>
      <SectionHeader title={title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsRail}
      >
        {products.slice(0, 5).map(renderProductCard)}
      </ScrollView>
    </View>
  );

  const activeBannerSlide = bannerSlides[bannerIndex];
  const activeBannerProduct =
    activeBannerSlide?.product || allDatasetProducts[0];
  const heroImage: ImageSourcePropType | undefined = activeBannerProduct?.image;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topArea}>
          <FoodClubHeader showSearch onSearch={openSearchResults} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow} numberOfLines={1}>
              {activeBannerSlide?.eyebrow || activeBannerProduct?.category}
            </Text>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {activeBannerSlide?.title || 'Premium Quality'}
            </Text>
            <Text style={styles.heroTitleRed} numberOfLines={1}>
              {activeBannerSlide?.subtitle || 'Farm Fresh'}
            </Text>
            <Text style={styles.heroText}>
              {activeBannerSlide?.description ||
                'Fresh chicken, soya, paneer and ready-to-cook favorites delivered with care.'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.heroButton}
              onPress={() => activeBannerProduct && openDetail(activeBannerProduct.id)}
            >
              <Text style={styles.heroButtonText}>Explore Now</Text>
              <Text style={styles.heroButtonArrow}>{ICONS.right}</Text>
            </TouchableOpacity>
          </View>
          {heroImage && (
            <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          )}
        </View>

        <View style={styles.dotsRow}>
          {bannerSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setBannerIndex(index)}
              style={[styles.dot, index === bannerIndex && styles.dotActive]}
            />
          ))}
        </View>

        <SectionHeader title="Shop By Category" />
        <View style={styles.categoriesPanel}>
          {productCategories.map(category => {
            const firstProduct = category.products[0];

            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                onPress={() => firstProduct && openDetail(firstProduct.id)}
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
            {whyItems.map(item => (
              <View key={item.id} style={styles.whyItem}>
                <View style={styles.whyIconCircle}>
                  <Text style={styles.whyIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whySub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {renderProductSection('Top Picks for You', allDatasetProducts.slice(0, 5), 'top')}
        {productCategories.map(category =>
          renderProductSection(category.name, category.products, category.id),
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
  topArea: {
    backgroundColor: PAGE_YELLOW,
    paddingBottom: 4,
  },
  heroCard: {
    minHeight: 162,
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: SOFT_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  heroCopy: {
    flex: 1,
    padding: 16,
    paddingRight: 8,
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
    marginBottom: 7,
  },
  heroTitle: {
    color: DARK,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  heroTitleRed: {
    color: RED,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 8,
  },
  heroText: {
    color: '#333333',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 12,
  },
  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: RED,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  heroButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 8,
    marginTop: -1,
  },
  heroImage: {
    width: width * 0.38,
    height: '100%',
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
  whyIcon: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
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
    marginBottom: 20,
  },
  productsRail: {
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 2,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    minHeight: 216,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productImageWrap: {
    height: 118,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    color: DARK,
    fontSize: 17,
    lineHeight: 18,
  },
  heartActive: {
    color: RED,
  },
  productBody: {
    padding: 10,
  },
  productName: {
    color: DARK,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    minHeight: 34,
  },
  productCategory: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  productPrice: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
  },
});

export default HomeScreen;
