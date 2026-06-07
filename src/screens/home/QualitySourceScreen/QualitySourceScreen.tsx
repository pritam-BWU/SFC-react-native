import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import { RootStackParamList } from '../../../navigation/types';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';

type Props = NativeStackScreenProps<RootStackParamList, 'QualitySource'>;

type SourceContent = {
  title: string;
  paragraphs: string[];
};

const sourceContentByCategory: Record<string, SourceContent> = {
  'cat-1': {
    title: 'Organic Country Chicken',
    paragraphs: [
      'At Superfowl Food Club, we aim to promote better food awareness by connecting members with carefully selected poultry products sourced from trusted farming environments. Our country chicken selections are intended to focus on freshness, hygiene, responsible sourcing practices, and natural-style rearing preferences wherever operationally feasible.',
      'The poultry products showcased on the platform may be sourced from farms and suppliers that emphasize cleaner feeding practices, controlled handling conditions, and responsible processing standards. Product availability, sourcing regions, and farming methods may vary depending on season, supplier network, operational region, and future commerce expansion.',
      'We encourage members to review individual product descriptions, handling instructions, and future quality-related updates as the platform evolves and expands its services.',
    ],
  },
  'cat-2': {
    title: 'Protein Rich Soya Selection',
    paragraphs: [
      'Superfowl Food Club aims to provide access to selected soy-based food products intended for users seeking protein-oriented food alternatives as part of their dietary preferences. Our soya selections may include products sourced from suppliers focusing on food-grade quality standards, packaging hygiene, and responsible processing practices.',
      'The platform may feature different forms of soy products including chunks, granules, nuggets, and related protein-based alternatives depending on product availability and future commerce operations. Product specifications, nutritional values, ingredient composition, and sourcing regions may vary across suppliers and operational categories.',
      'Members are advised to review individual product labels, nutritional guidance, allergen information, and preparation recommendations wherever applicable.',
    ],
  },
  'cat-3': {
    title: 'Dairy & Paneer Collection',
    paragraphs: [
      'Superfowl Food Club aims to feature dairy and paneer selections sourced from suppliers focusing on freshness, hygienic handling, and standard food-quality practices. Our platform intends to prioritize products prepared, stored, and handled under suitable food safety and operational standards wherever applicable.',
      'The paneer and dairy products displayed on the platform may include selections from trusted vendors and approved sourcing partners depending on operational availability and service regions. Product texture, fat content, freshness duration, and packaging formats may vary based on supplier practices and regional supply conditions.',
      'Members are encouraged to refer to individual product information, storage guidance, and usage recommendations whenever available on the platform.',
    ],
  },
  'cat-4': {
    title: 'Ready-to-Cook Delights',
    paragraphs: [
      'Superfowl Food Club aims to feature selected ready-to-cook food products prepared with focus on convenience, hygiene, freshness, and responsible ingredient sourcing wherever operationally applicable. These products are intended to support modern households seeking quicker meal preparation while maintaining food-quality awareness.',
      'Our ready-to-cook selections may include marinated products, cut-and-clean preparations, semi-processed food items, frozen convenience foods, and chef-inspired meal preparations sourced from approved vendors and food preparation partners depending on operational availability and regional supply networks.',
      'The platform aims to prioritize products prepared under suitable handling, storage, packaging, and food safety practices wherever feasible. Ingredients, spice levels, preparation styles, shelf life, and packaging formats may vary depending on product category, supplier standards, and operational regions.',
      'Members are encouraged to review product descriptions, storage instructions, cooking recommendations, allergen information, and usage guidance provided with individual products wherever available.',
    ],
  },
};

const QualitySourceScreen = ({ navigation, route }: Props) => {
  const content =
    sourceContentByCategory[route.params.categoryId] ||
    sourceContentByCategory['cat-1'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <FoodClubHeader
        title="Quality & Source"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Icon name="shield-check-outline" color="#FFFFFF" size={28} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>Category source details</Text>
            <Text style={styles.heroTitle}>{content.title}</Text>
          </View>
        </View>

        <View style={styles.bodyCard}>
          {content.paragraphs.map(paragraph => (
            <Text key={paragraph} style={styles.paragraph}>
              {paragraph}
            </Text>
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
    padding: 16,
    paddingBottom: 96,
  },
  heroCard: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 14,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroCopy: {
    flex: 1,
  },
  heroLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    color: DARK,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    marginTop: 4,
  },
  bodyCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginTop: 14,
  },
  paragraph: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 14,
  },
});

export default QualitySourceScreen;
