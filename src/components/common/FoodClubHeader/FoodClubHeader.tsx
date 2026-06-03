import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';

const ICONS = {
  back: '\u2039',
  search: '\u2315',
};

type Props = {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  initialSearch?: string;
  onBack?: () => void;
  onSearch?: (query: string) => void;
};

const FoodClubHeader = ({
  title,
  showBack,
  showSearch,
  initialSearch = '',
  onBack,
  onSearch,
}: Props) => {
  const [query, setQuery] = useState(initialSearch);

  const submitSearch = () => {
    const nextQuery = query.trim();

    if (nextQuery) {
      onSearch?.(nextQuery);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backIcon}>{ICONS.back}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backSpacer} />
        )}

        <View style={styles.logoWrap}>
          <Text style={styles.logoText} numberOfLines={1}>
            <Text style={styles.logoRed}>Superfowl </Text>
            <Text style={styles.logoDark}>Food</Text>
            <Text style={styles.logoRed}>Club</Text>
          </Text>
          <Text style={styles.logoSub} numberOfLines={1}>
            Better Food. Better You.
          </Text>
        </View>

        {title ? (
          <Text style={styles.pageTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={styles.titleSpacer} />
        )}
      </View>

      {showSearch ? (
        <View style={styles.searchBox}>
          <TouchableOpacity
            activeOpacity={0.78}
            style={styles.searchIconButton}
            onPress={submitSearch}
          >
            <Text style={styles.searchIcon}>{ICONS.search}</Text>
          </TouchableOpacity>
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            placeholder="Search chicken, paneer, soya..."
            placeholderTextColor="#888888"
            returnKeyType="search"
            onSubmitEditing={submitSearch}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: PAGE_YELLOW,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
  },
  brandRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  backSpacer: {
    width: 0,
  },
  backIcon: {
    color: DARK,
    fontSize: 30,
    lineHeight: 30,
  },
  logoWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    paddingLeft: 2,
    paddingRight: 10,
  },
  logoText: {
    color: DARK,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'left',
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
    lineHeight: 12,
    fontWeight: '800',
    marginTop: -1,
    textAlign: 'left',
  },
  pageTitle: {
    maxWidth: 126,
    color: DARK,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'right',
  },
  titleSpacer: {
    width: 0,
  },
  searchBox: {
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  searchIconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  searchIcon: {
    color: MUTED,
    fontSize: 23,
  },
  searchInput: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 0,
  },
});

export default FoodClubHeader;
