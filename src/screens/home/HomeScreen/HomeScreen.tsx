import React, { useEffect, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  cat1Products,
  cat2Products,
  DatasetProduct,
} from '../../../data/productDataset';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';
const PRODUCT_WIDTH = (width - 44) / 2;

const ICONS = {
  menu: '\u2630',
  search: '\u2315',
  filter: '\u25BD',
  chicken: '\u{1F414}',
  soya: '\u{1FAD8}',
  paneer: '\u25A7',
  nugget: '\u25CF',
  shield: '\u{1F6E1}\uFE0F',
  leaf: '\u{1F331}',
  truck: '\u{1F69A}',
  check: '\u2713',
  heart: '\u2764\uFE0F',
  heartEmpty: '\u2661',
  bell: '\u{1F514}',
  plus: '+',
  right: '\u203A',
  home: '\u2302',
  grid: '\u25A6',
  crown: '\u{1F451}',
  bag: '\u{1F6CD}\uFE0F',
  account: '\u{1F464}',
};

type WhyItem = {
  id: string;
  title: string;
  sub: string;
  icon: string;
};

type Recipe = {
  id: string;
  title: string;
  tag: string;
  image: ImageSourcePropType;
  productId: ProductDetailId;
};

type ProductDetailId = RootStackParamList['ProductDetail']['productId'];

const images = {
  freshChicken: {
    uri: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=85',
  },
  soyaChunks: {
    uri: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=85',
  },
  paneer: {
    uri: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85',
  },
  processedChicken: {
    uri: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=85',
  },
  banner: {
    uri: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=900&q=85',
  },
  fishRecipe: {
    uri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=85',
  },
};

const bannerImages: ImageSourcePropType[] = [
  images.banner,
  images.freshChicken,
  images.paneer,
];

const whyItems: WhyItem[] = [
  {
    id: 'fresh',
    title: '100% Fresh',
    sub: 'Daily checked',
    icon: ICONS.check,
  },
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
  {
    id: 'delivery',
    title: 'On-Time',
    sub: 'Fast delivery',
    icon: ICONS.truck,
  },
];

const recipes: Recipe[] = [
  {
    id: 'chicken-recipe',
    title: 'Chicken Curry',
    tag: 'Chicken',
    image: images.freshChicken,
    productId: 'fresh-chicken',
  },
  {
    id: 'paneer-recipe',
    title: 'Paneer Tikka',
    tag: 'Paneer',
    image: images.paneer,
    productId: 'paneer',
  },
  {
    id: 'fish-recipe',
    title: 'Fish Fry',
    tag: 'Fish',
    image: images.fishRecipe,
    productId: 'fish',
  },
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

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const searchSuggestions = cat2Products
    .filter(product =>
      product.name.toLowerCase().includes(searchText.trim().toLowerCase()),
    )
    .slice(0, 10);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(current => (current + 1) % bannerImages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

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

  const renderProductCard = (product: DatasetProduct) => (
    <TouchableOpacity
      key={product.id}
      activeOpacity={0.85}
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
          <Text style={styles.discountText}>Fresh</Text>
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
        <Text style={styles.productWeight} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.productDescription} numberOfLines={3}>
          {product.overview}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{product.priceStartingFrom}</Text>
          <TouchableOpacity activeOpacity={0.85} style={styles.addButton}>
            <Text style={styles.addText}>{ICONS.plus}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.75} style={styles.headerButton}>
            <Text style={styles.headerIcon}>{ICONS.menu}</Text>
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>
              <Text style={styles.logoRed}>Superfowl </Text>
              <Text style={styles.logoDark}>Food</Text>
              <Text style={styles.logoRed}>Club</Text>
            </Text>
            <Text style={styles.logoSub}>Better Food. Better You.</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>{ICONS.search}</Text>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              placeholder="Search soya, chaap, chunks..."
              placeholderTextColor="#888888"
            />
          </View>
          <TouchableOpacity activeOpacity={0.85} style={styles.filterButton}>
            <Text style={styles.filterIcon}>{ICONS.filter}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.searchSuggestionsRow}
        >
          {searchSuggestions.map(product => (
            <TouchableOpacity
              key={product.id}
              activeOpacity={0.85}
              style={styles.searchChip}
              onPress={() => openDetail(product.id)}
            >
              <Image
                source={product.image}
                style={styles.searchChipImage}
                resizeMode="cover"
              />
              <View style={styles.searchChipTextCol}>
                <Text style={styles.searchChipTitle} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.searchChipPrice}>
                  {product.priceStartingFrom}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Premium Quality.</Text>
            <Text style={styles.heroTitleRed}>Farm Fresh.</Text>
            <Text style={styles.heroText}>
              Fresh chicken, soya, paneer and ready-to-cook favorites delivered
              with care.
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Shop Now</Text>
              <Text style={styles.heroButtonArrow}>{ICONS.right}</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={bannerImages[bannerIndex]}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.dotsRow}>
          {bannerImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setBannerIndex(index)}
              style={[styles.dot, index === bannerIndex && styles.dotActive]}
            />
          ))}
        </View>

        <SectionHeader title="Shop By Category" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesPanel}
        >
          {cat1Products.map(category => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.85}
              onPress={() => openDetail(category.id)}
              style={styles.categoryItem}
            >
              <View style={styles.categoryIconCircle}>
                <Image
                  source={category.image}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.whyPanel}>
          <Text style={styles.whyHeading}>Why Choose Superfowl FoodClub?</Text>
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

        <SectionHeader title="Top Picks for You" />
        <View style={styles.productsRow}>
          {cat1Products.map(renderProductCard)}
        </View>

        <SectionHeader title="Recipes & Inspiration" />
        <View style={styles.recipesRow}>
          {recipes.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={0.85}
              onPress={() => openDetail(recipe.productId)}
              style={styles.recipeCard}
            >
              <Image
                source={recipe.image}
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <View style={styles.recipeTextWrap}>
                <Text style={styles.recipeTitle} numberOfLines={1}>
                  {recipe.title}
                </Text>
                <Text style={styles.recipeTag}>{recipe.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity activeOpacity={0.75} style={styles.tabItem}>
          <Text style={[styles.tabIcon, styles.tabActive]}>{ICONS.home}</Text>
          <Text style={[styles.tabLabel, styles.tabActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75} style={styles.tabItem}>
          <Text style={styles.tabIcon}>{ICONS.grid}</Text>
          <Text style={styles.tabLabel}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.quickOrderTab}
          onPress={() => navigation.navigate('Subscription')}
        >
          <View style={styles.quickOrderCircle}>
            <Text style={styles.quickOrderIcon}>{ICONS.crown}</Text>
          </View>
          <Text style={styles.quickOrderLabel}>Membership</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75} style={styles.tabItem}>
          <Text style={styles.tabIcon}>{ICONS.bell}</Text>
          <Text style={styles.tabLabel}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.tabIcon}>{ICONS.account}</Text>
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 78,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: PAGE_YELLOW,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: DARK,
    fontSize: 23,
    fontWeight: '900',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  logoWrap: {
    flex: 1,
    marginLeft: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
  },
  logoRed: {
    color: RED,
  },
  logoDark: {
    color: DARK,
  },
  logoSub: {
    color: '#333333',
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: PAGE_YELLOW,
  },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchIcon: {
    color: '#777777',
    fontSize: 22,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  searchSuggestionsRow: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: PAGE_YELLOW,
  },
  searchChip: {
    width: 162,
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  searchChipImage: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 8,
  },
  searchChipTextCol: {
    flex: 1,
  },
  searchChipTitle: {
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
  },
  searchChipPrice: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
  },
  heroCard: {
    height: 150,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: SOFT_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  heroCopy: {
    flex: 1,
    padding: 13,
    paddingRight: 8,
    justifyContent: 'center',
  },
  heroTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  heroTitleRed: {
    color: RED,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: RED,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroButtonArrow: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 8,
    marginTop: -1,
  },
  heroImage: {
    width: width * 0.43,
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F2DFA0',
  },
  dotActive: {
    width: 20,
    backgroundColor: RED,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 7,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '900',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: RED,
    fontSize: 13,
    fontWeight: '800',
  },
  viewAllIcon: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 2,
  },
  categoriesPanel: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  categoryItem: {
    width: 82,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    paddingVertical: 8,
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    color: DARK,
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
    minHeight: 22,
    textAlign: 'center',
  },
  whyPanel: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    paddingVertical: 10,
  },
  whyHeading: {
    color: RED,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  whyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  whyItem: {
    width: '24%',
    alignItems: 'center',
  },
  whyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3D36A',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  whyIcon: {
    color: RED,
    fontSize: 18,
    fontWeight: '900',
  },
  whyTitle: {
    color: DARK,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  whySub: {
    color: MUTED,
    fontSize: 8.5,
    lineHeight: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productImageWrap: {
    height: 112,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 5,
    borderRadius: 12,
    backgroundColor: RED,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },
  heartButton: {
    position: 'absolute',
    top: 7,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.94)',
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
    minHeight: 148,
    padding: 9,
  },
  productName: {
    color: DARK,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    minHeight: 30,
  },
  productWeight: {
    color: MUTED,
    fontSize: 9.5,
    marginTop: 4,
  },
  productDescription: {
    color: '#333333',
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '600',
    minHeight: 39,
    marginTop: 6,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  productPrice: {
    color: DARK,
    fontSize: 14,
    fontWeight: '900',
  },
  productUnit: {
    color: MUTED,
    fontSize: 7.5,
    fontWeight: '700',
  },
  addButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  recipesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  recipeCard: {
    width: (width - 44) / 3,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 45,
  },
  recipeTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  recipeTitle: {
    color: DARK,
    fontSize: 9.5,
    fontWeight: '900',
  },
  recipeTag: {
    color: RED,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 1,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
  },
  tabItem: {
    width: 68,
    alignItems: 'center',
    paddingTop: 8,
  },
  tabIcon: {
    color: '#555555',
    fontSize: 24,
  },
  tabActive: {
    color: RED,
  },
  tabLabel: {
    color: '#555555',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  quickOrderTab: {
    width: 82,
    alignItems: 'center',
    marginTop: -24,
  },
  quickOrderCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    elevation: 6,
    shadowColor: RED,
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  quickOrderIcon: {
    color: '#FFFFFF',
    fontSize: 26,
  },
  quickOrderLabel: {
    color: RED,
    fontSize: 9.5,
    fontWeight: '900',
  },
});

export default HomeScreen;
