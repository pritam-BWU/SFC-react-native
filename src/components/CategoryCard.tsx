import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Category} from '../data/dummyData';

interface Props {
  item: Category;
  onPress?: () => void;
}

const CategoryCard: React.FC<Props> = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrap}>
        <Icon name={item.icon} size={26} color="#D50000" />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 10,
    width: 62,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E1',
    borderWidth: 1.5,
    borderColor: '#FFD400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 13,
  },
});

export default CategoryCard;
