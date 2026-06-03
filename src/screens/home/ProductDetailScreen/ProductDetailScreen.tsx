import React, { useState } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import { getDatasetProductById } from '../../../data/productDataset';
import { RootStackParamList } from '../../../navigation/types';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const HERO_HEIGHT = Math.max(150, Math.min(210, SCREEN_HEIGHT * 0.24));

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

type Detail = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  marketPrice: string;
  memberPrice: string;
  save: string;
  pack: string;
  about: string;
  nutrition?: string;
  nutritionItems: string[];
  jsonSource?: string;
  howToUse?: string;
  sourceTitle: string;
  sourceText: string;
  highlights: {
    icon: string;
    title: string;
  }[];
};

const images = {
  chicken: {
    uri: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=900&q=85',
  },
  soya: {
    uri: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&q=85',
  },
  paneer: {
    uri: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&q=85',
  },
  processed: {
    uri: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=900&q=85',
  },
  fish: {
    uri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=900&q=85',
  },
  farm: {
    uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=85',
  },
};

const DETAILS: Record<string, Detail> = {
  'fresh-chicken': {
    title: 'Fresh Chicken Curry Cut',
    subtitle: 'Chilled | 500g Pack',
    image: images.chicken,
    marketPrice: '\u20B9159',
    memberPrice: '20-40% OFF',
    save: '20-40%',
    pack: '500g',
    about:
      'Tender, protein-rich chicken pieces, hygienically cleaned and carefully packed for fresh home cooking.',
    sourceTitle: 'Sourced from trusted farms',
    sourceText:
      'Our chicken is sourced from certified farms that follow strong hygiene and freshness standards.',
    nutritionItems: ['High Protein', 'No Added Hormones', 'Hygienically Processed'],
    highlights: [
      { icon: 'Dumbbell', title: 'High Protein' },
      { icon: 'ShieldCheck', title: 'Hygienically Processed' },
      { icon: 'Snowflake', title: 'Freshly Packed' },
    ],
  },
  'soya-chunks': {
    title: 'Soya Chunks',
    subtitle: 'Protein Rich | 500g Pack',
    image: images.soya,
    marketPrice: '\u20B9109',
    memberPrice: '20-40% OFF',
    save: '20-40%',
    pack: '500g',
    about:
      'Protein-packed soya chunks for healthy curries, snacks, and everyday meals with a firm bite.',
    sourceTitle: 'Made from quality soy',
    sourceText:
      'Selected soy is processed in clean facilities to keep texture, nutrition, and taste consistent.',
    nutritionItems: ['High Protein', 'Vegetarian', 'Easy To Cook'],
    highlights: [
      { icon: 'Dumbbell', title: 'High Protein' },
      { icon: 'Leaf', title: 'Vegetarian' },
      { icon: 'CookingPot', title: 'Easy To Cook' },
    ],
  },
  paneer: {
    title: 'Fresh Paneer',
    subtitle: 'Soft Cubes | 250g Pack',
    image: images.paneer,
    marketPrice: '\u20B9129',
    memberPrice: '20-40% OFF',
    save: '20-40%',
    pack: '250g',
    about:
      'Soft, creamy paneer cubes made for curries, starters, and quick high-protein vegetarian meals.',
    sourceTitle: 'Prepared from fresh milk',
    sourceText:
      'Fresh milk is handled with hygienic care to create paneer with clean taste and soft texture.',
    nutritionItems: ['Rich In Protein', 'Fresh Milk', 'Soft Texture'],
    highlights: [
      { icon: 'Dumbbell', title: 'Rich In Protein' },
      { icon: 'Milk', title: 'Fresh Milk' },
      { icon: 'BadgeCheck', title: 'Soft Texture' },
    ],
  },
  'processed-chicken': {
    title: 'Chicken Nuggets',
    subtitle: 'Ready To Cook | 250g Pack',
    image: images.processed,
    marketPrice: '\u20B9149',
    memberPrice: '20-40% OFF',
    save: '20-40%',
    pack: '250g',
    about:
      'Crispy ready-to-cook chicken nuggets for quick snacks, lunch boxes, and family treat plates.',
    sourceTitle: 'Processed with care',
    sourceText:
      'Prepared under controlled hygiene standards and packed for reliable taste and convenience.',
    nutritionItems: ['Quick Snack', 'Quality Checked', 'Ready To Cook'],
    highlights: [
      { icon: 'Zap', title: 'Quick Snack' },
      { icon: 'ShieldCheck', title: 'Quality Checked' },
      { icon: 'Flame', title: 'Ready To Cook' },
    ],
  },
  fish: {
    title: 'Fresh Fish',
    subtitle: 'Cleaned | 500g Pack',
    image: images.fish,
    marketPrice: '\u20B9320',
    memberPrice: '20-40% OFF',
    save: '20-40%',
    pack: '500g',
    about:
      'Fresh cleaned fish with delicate texture, ideal for frying, curry, and simple home-style meals.',
    sourceTitle: 'Sourced from trusted fisheries',
    sourceText:
      'Our fish is selected for freshness and cleaned carefully before hygienic packing.',
    nutritionItems: ['Fresh Catch', 'Cleaned Well', 'Rich Taste'],
    highlights: [
      { icon: 'Snowflake', title: 'Fresh Catch' },
      { icon: 'ShieldCheck', title: 'Cleaned Well' },
      { icon: 'Utensils', title: 'Rich Taste' },
    ],
  },
};

const tabs = ['About the Product', 'Nutrition'];

const tabIcons: Record<string, string> = {
  'About the Product': 'information-outline',
  Nutrition: 'food-apple-outline',
};

const productHighlightIcons: Record<string, string> = {
  Activity: 'run',
  BadgeCheck: 'check-decagram-outline',
  Beef: 'food-steak',
  Bird: 'bird',
  Briefcase: 'briefcase-outline',
  ChefHat: 'chef-hat',
  CircleDot: 'circle-slice-8',
  Clock: 'clock-outline',
  CookingPot: 'pot-steam-outline',
  Drumstick: 'food-drumstick-outline',
  Dumbbell: 'dumbbell',
  Flame: 'fire',
  GlassWater: 'glass-mug-variant',
  Knife: 'silverware',
  Leaf: 'leaf',
  Milk: 'cup-water',
  Nut: 'peanut-outline',
  PartyPopper: 'party-popper',
  Pepper: 'chili-mild-outline',
  Salad: 'food-apple-outline',
  Sandwich: 'hamburger',
  ShieldCheck: 'shield-check-outline',
  Snowflake: 'snowflake',
  Sparkles: 'sparkles',
  Utensils: 'silverware-fork-knife',
  UtensilsCrossed: 'silverware-variant',
  Users: 'account-group-outline',
  Zap: 'lightning-bolt-outline',
};

const normalizeIconName = (name: string) => name.replace(/[\s_-]/g, '');

const HighlightIcon = ({ name }: { name: string }) => {
  return (
    <Icon
      name={
        productHighlightIcons[name] ||
        productHighlightIcons[normalizeIconName(name)] ||
        productHighlightIcons.ShieldCheck
      }
      color={RED}
      size={21}
    />
  );
};

const ProductDetailScreen = ({ navigation, route }: Props) => {
  const datasetProduct = getDatasetProductById(route.params.productId);
  const detail: Detail = datasetProduct
    ? {
        title: datasetProduct.name,
        subtitle: `${datasetProduct.category} | ${datasetProduct.priceStartingFrom}`,
        image: datasetProduct.image,
        marketPrice: datasetProduct.priceStartingFrom,
        memberPrice: '20-40% OFF',
        save: '20-40%',
        pack: datasetProduct.priceStartingFrom.replace(/^₹\d+\/?/, '') || 'pack',
        about: datasetProduct.overview,
        nutrition: datasetProduct.nutrition,
        nutritionItems: datasetProduct.nutritionItems,
        jsonSource: datasetProduct.source,
        howToUse: datasetProduct.howToUse,
        sourceTitle: datasetProduct.source,
        sourceText: datasetProduct.howToUse,
        highlights: datasetProduct.highlights || [],
      }
    : DETAILS[route.params.productId] || DETAILS['fresh-chicken'];
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const isNutritionTab = activeTab === 'Nutrition';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <FoodClubHeader showBack onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.hero}>
          <Image
            source={detail.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.heroButton, styles.heartButton]}
            onPress={() => setFavorite(current => !current)}
          >
            <Icon
              name={favorite ? 'heart' : 'heart-outline'}
              color={favorite ? RED : DARK}
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.heroButton, styles.shareButton]}
          >
            <Icon name="share-variant-outline" color={DARK} size={23} />
          </TouchableOpacity>
          <View style={styles.hygieneBadge}>
            <Icon name="shield-check-outline" color={RED} size={21} />
            <Text style={styles.hygieneText}>100%{'\n'}Hygienic</Text>
          </View>
          <View style={styles.slideBadge}>
            <Text style={styles.slideText}>1/5</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{detail.title}</Text>
              <View style={styles.subtitleRow}>
                <Icon name="snowflake" color={MUTED} size={14} />
                <Text style={styles.subtitle}>{detail.subtitle}</Text>
              </View>
            </View>
            <View style={styles.ratingWrap}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>4.6</Text>
                <Icon name="star" color="#FFFFFF" size={12} />
              </View>
            </View>
          </View>

          <View style={styles.priceCard}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Starting From</Text>
              <Text style={styles.marketPrice}>
                {detail.marketPrice}
              </Text>
              <Text style={styles.kgText}>({detail.pack})</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceBlock}>
              <Text style={styles.memberLabel}>Member Pricing Benefit</Text>
              <Text style={styles.memberPrice}>
                {detail.memberPrice}
              </Text>
              <Text style={styles.kgText}>Eligible on selected orders</Text>
            </View>
            <View style={styles.saveBox}>
              <Text style={styles.saveTitle}>Offer</Text>
              <Text style={styles.savePrice}>{detail.save}</Text>
              <Text style={styles.saveSub}>OFF</Text>
            </View>
          </View>

          <View style={styles.deliveryCard}>
            <Icon name="truck-delivery-outline" color={RED} size={23} />
            <View style={styles.deliveryTextCol}>
              <Text style={styles.deliveryTitle}>Ordering Coming Soon</Text>
              <Text style={styles.deliverySub}>
                Ordering services will become available soon.
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} style={styles.notifyButton}>
              <Icon name="bell-ring-outline" color={RED} size={13} />
              <Text style={styles.notifyText}>Notify Me</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
                style={styles.tabButton}
              >
                <Icon
                  name={tabIcons[tab]}
                  color={activeTab === tab ? RED : MUTED}
                  size={15}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon
                name={isNutritionTab ? 'food-apple-outline' : 'information-outline'}
                color={RED}
                size={18}
              />
              <Text style={styles.sectionTitle}>
                {isNutritionTab ? 'Nutrition' : 'About this product'}
              </Text>
            </View>
            {isNutritionTab ? (
              <View style={styles.jsonDetailsList}>
                {detail.nutritionItems.map(item => (
                  <View key={item} style={styles.nutritionRow}>
                    <Icon
                      name="check-circle-outline"
                      color={RED}
                      size={16}
                      style={styles.nutritionIcon}
                    />
                    <Text style={styles.jsonDetailText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <>
                <Text style={styles.aboutText}>{detail.about}</Text>

                <View style={styles.benefitsRow}>
                  {detail.highlights.map(highlight => (
                    <View
                      key={`${highlight.icon}-${highlight.title}`}
                      style={styles.benefitItem}
                    >
                      <View style={styles.benefitIconCircle}>
                        <HighlightIcon name={highlight.icon} />
                      </View>
                      <Text style={styles.benefitText}>{highlight.title}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.sourceCard}>
            <View style={styles.sourceHeader}>
              <View style={styles.sourceHeadingRow}>
                <Icon name="shield-check-outline" color={DARK} size={16} />
                <Text style={styles.sourceHeading}>Quality & Source</Text>
              </View>
              <View style={styles.viewDetailsRow}>
                <Text style={styles.viewDetails}>View Details</Text>
                <Icon name="chevron-right" color={RED} size={16} />
              </View>
            </View>
            <View style={styles.sourceBody}>
              <View style={styles.sourceIconCircle}>
                <Icon name="shield-check-outline" color="#FFFFFF" size={22} />
              </View>
              <View style={styles.sourceTextCol}>
                <Text style={styles.sourceTitle}>{detail.sourceTitle}</Text>
                <Text style={styles.sourceText}>{detail.sourceText}</Text>
              </View>
              <Image source={images.farm} style={styles.sourceImage} />
            </View>
          </View>

          <View style={styles.memberCard}>
            <Icon
              name="crown-outline"
              color={RED}
              size={30}
              style={styles.memberIcon}
            />
            <View style={styles.memberTextCol}>
              <Text style={styles.memberTitle}>Member Benefits</Text>
              <Text style={styles.memberSub}>
                Eligible Members will receive selected pricing benefits upon
                ordering services become available.
              </Text>
              <Text style={styles.memberNote}>
                Membership benefits may vary by product, location, and availability.
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} style={styles.planButton}>
              <Text style={styles.planText}>View Plans</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionBar}>
          <View style={styles.bottomPriceCol}>
            <Text style={styles.bottomPrice}>{detail.marketPrice}</Text>
            <Text style={styles.bottomLabel}>Starting From</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.wishlistButton}
            onPress={() => setFavorite(current => !current)}
          >
            <Icon
              name={favorite ? 'heart' : 'heart-outline'}
              color={RED}
              size={15}
            />
            <Text style={styles.wishlistText}>Add to Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.orderButton}>
            <Icon name="shopping-outline" color="#FFFFFF" size={15} />
            <Text style={styles.orderText}>Ordering Coming Soon</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 74,
  },
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: SOFT_YELLOW,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    right: 66,
    top: 12,
  },
  shareButton: {
    right: 14,
    top: 12,
  },
  heroIcon: {
    color: DARK,
    fontSize: 23,
    lineHeight: 24,
  },
  favorite: {
    color: RED,
  },
  shareIcon: {
    color: DARK,
    fontSize: 24,
    fontWeight: '900',
    transform: [{ rotate: '25deg' }],
  },
  hygieneBadge: {
    position: 'absolute',
    left: 14,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFDF0',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  hygieneIcon: {
    color: RED,
    fontSize: 19,
    marginRight: 6,
  },
  hygieneText: {
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 13,
  },
  slideBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  slideText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingWrap: {
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 7,
    backgroundColor: RED,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  priceBlock: {
    flex: 1,
  },
  priceLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
  },
  marketPrice: {
    color: DARK,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },
  pack: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
  },
  kgText: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  memberLabel: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
  },
  memberPrice: {
    color: RED,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },
  priceDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#EFE5C2',
    marginHorizontal: 8,
  },
  saveBox: {
    width: 62,
    borderRadius: 8,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    paddingVertical: 7,
  },
  saveTitle: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
  },
  savePrice: {
    color: RED,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3,
  },
  saveSub: {
    color: DARK,
    fontSize: 9,
    fontWeight: '800',
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: SOFT_YELLOW,
    padding: 9,
  },
  deliveryIcon: {
    color: RED,
    fontSize: 22,
    marginRight: 8,
  },
  deliveryTextCol: {
    flex: 1,
    marginLeft: 8,
  },
  deliveryTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  deliverySub: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RED,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  notifyText: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
  },
  tabsRow: {
    gap: 20,
    paddingTop: 11,
    paddingBottom: 7,
  },
  tabText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '800',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 5,
  },
  activeTabText: {
    color: RED,
    borderBottomWidth: 2,
    borderBottomColor: RED,
  },
  section: {
    paddingTop: 4,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '900',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aboutText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 5,
  },
  jsonDetailsList: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFDF3',
    overflow: 'hidden',
  },
  jsonDetailRow: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5C2',
  },
  jsonDetailLabel: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 4,
  },
  jsonDetailText: {
    color: DARK,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5C2',
  },
  nutritionIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  nutritionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED,
    marginRight: 8,
    marginTop: 5,
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  benefitItem: {
    width: '23%',
    alignItems: 'center',
  },
  benefitIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3D36A',
    backgroundColor: '#FFFDF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  benefitIcon: {
    color: RED,
    fontSize: 20,
    marginBottom: 3,
  },
  benefitText: {
    color: DARK,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 12,
  },
  sourceCard: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: SOFT_YELLOW,
    padding: 10,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  sourceHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sourceHeading: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
  },
  viewDetails: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  sourceIcon: {
    color: '#FFFFFF',
    fontSize: 21,
  },
  sourceTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  sourceTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  sourceText: {
    color: '#333333',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  sourceImage: {
    width: 78,
    height: 50,
    borderRadius: 7,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 10,
  },
  memberIcon: {
    color: RED,
    fontSize: 28,
    marginRight: 9,
  },
  memberTextCol: {
    flex: 1,
  },
  memberTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
  },
  memberSub: {
    color: DARK,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  memberNote: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  planButton: {
    borderRadius: 8,
    backgroundColor: RED,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  planText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  actionBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  bottomPriceCol: {
    width: 68,
  },
  bottomPrice: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  bottomLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  wishlistButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RED,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistText: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
  },
  orderButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#D8A000',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});

export default ProductDetailScreen;
