import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import {
  allDatasetProducts,
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
const CARD_WIDTH = (width - 48) / 2;

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

const normalize = (value: string) => value.trim().toLowerCase();

const SearchResultsScreen = ({ navigation, route }: Props) => {
  const query = route.params.query;

  const searchData = useMemo(() => {
    const normalizedQuery = normalize(query);
    const matchingCategories = productCategories.filter(category =>
      normalize(category.name).includes(normalizedQuery),
    );

    const matchingProducts = allDatasetProducts.filter(product => {
      const searchText = [
        product.name,
        product.category,
        product.overview,
        product.nutrition,
        product.source,
      ]
        .join(' ')
        .toLowerCase();

      return searchText.includes(normalizedQuery);
    });

    return {
      categories: matchingCategories.length
        ? matchingCategories
        : productCategories.filter(category =>
            category.products.some(product =>
              matchingProducts.some(match => match.id === product.id),
            ),
          ),
      products: matchingProducts.length ? matchingProducts : allDatasetProducts,
      hasExactResults: matchingProducts.length > 0 || matchingCategories.length > 0,
    };
  }, [query]);

  const openProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const runSearch = (nextQuery: string) => {
    navigation.replace('SearchResults', { query: nextQuery });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <FoodClubHeader
        title="Search Products"
        showBack
        showSearch
        initialSearch={query}
        onBack={() => navigation.goBack()}
        onSearch={runSearch}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>Showing results for</Text>
          <Text style={styles.summaryTitle} numberOfLines={2}>
            {query}
          </Text>
          <Text style={styles.summaryText}>
            {searchData.hasExactResults
              ? `${searchData.products.length} products matched your search.`
              : 'No exact match found, so here are all Food Club products.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Matching Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRail}
        >
          {searchData.categories.map(category => {
            const firstProduct = category.products[0];

            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                style={styles.categoryCard}
                onPress={() => firstProduct && openProduct(firstProduct.id)}
              >
                {firstProduct ? (
                  <Image
                    source={firstProduct.image}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                ) : null}
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {category.products.length} products
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Products</Text>
        <View style={styles.productGrid}>
          {searchData.products.map(product => (
            <TouchableOpacity
              key={product.id}
              activeOpacity={0.86}
              style={styles.productCard}
              onPress={() => openProduct(product.id)}
            >
              <View style={styles.productImageWrap}>
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.memberBadge}>
                  <Text style={styles.memberBadgeText}>Member Benefit</Text>
                </View>
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
          ))}
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
  content: {
    padding: 14,
    paddingBottom: 96,
  },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 16,
  },
  summaryEyebrow: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
  },
  summaryTitle: {
    color: DARK,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  summaryText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 10,
  },
  categoryRail: {
    gap: 10,
    paddingRight: 8,
  },
  categoryCard: {
    width: 138,
    minHeight: 154,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  categoryImage: {
    width: '100%',
    height: 78,
    borderRadius: 11,
    backgroundColor: SOFT_YELLOW,
  },
  categoryName: {
    color: DARK,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    marginTop: 8,
  },
  categoryCount: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 5,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productImageWrap: {
    height: 122,
    backgroundColor: SOFT_YELLOW,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  memberBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: 11,
    backgroundColor: RED,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
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

export default SearchResultsScreen;
