import React from 'react';
import {
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
import { productCategories } from '../../../data/productDataset';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';

const CategoriesScreen = ({ navigation, route }: Props) => {
  const categories = route.params?.categoryId
    ? productCategories.filter(category => category.id === route.params?.categoryId)
    : productCategories;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <FoodClubHeader title="Categories" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Browse Superfowl Food Club products by category.</Text>
        </View>

        {categories.map(category => (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.name}</Text>
            {category.products.slice(0, 10).map(product => (
              <TouchableOpacity
                key={product.id}
                activeOpacity={0.84}
                style={styles.productRow}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: product.id })
                }
              >
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productCopy}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice} numberOfLines={1}>
                    {product.priceStartingFrom}
                  </Text>
                </View>
                <Text style={styles.chevron}>{'\u203A'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
    paddingBottom: 96,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 2,
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 12,
  },
  sectionTitle: {
    color: RED,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 10,
  },
  productRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 8,
  },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 10,
  },
  productCopy: {
    flex: 1,
  },
  productName: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
  },
  productPrice: {
    color: RED,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  chevron: {
    color: RED,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
    marginLeft: 8,
  },
});

export default CategoriesScreen;
