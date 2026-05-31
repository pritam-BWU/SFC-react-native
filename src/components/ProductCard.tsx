import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Product} from '../data/dummyData';

interface Props {
  item: Product;
}

const ProductCard: React.FC<Props> = ({item}) => {
  const [wished, setWished] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.imgWrap}>
        <Image source={{uri: item.image}} style={styles.img} resizeMode="cover" />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => setWished(prev => !prev)}
          activeOpacity={0.8}>
          <Icon
            name={wished ? 'heart' : 'heart-outline'}
            size={14}
            color="#D50000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.weight} numberOfLines={1}>
          {item.weight}
        </Text>
        <Text style={styles.price}>
          {item.price}{' '}
          <Text style={styles.perPack}>/ pack</Text>
        </Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberText}>{item.memberPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 145,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imgWrap: {
    height: 105,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  info: {
    padding: 9,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  weight: {
    fontSize: 9,
    color: '#888',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 5,
  },
  perPack: {
    fontSize: 9,
    fontWeight: '400',
    color: '#999',
  },
  memberBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  memberText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D50000',
  },
});

export default ProductCard;
