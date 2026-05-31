import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Feature} from '../data/dummyData';

interface Props {
  item: Feature;
}

const FeatureCard: React.FC<Props> = ({item}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name={item.icon} size={22} color="#D50000" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF8E1',
    borderWidth: 1.5,
    borderColor: '#FFD400',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    lineHeight: 13,
  },
});

export default FeatureCard;
