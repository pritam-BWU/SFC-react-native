import { ImageSourcePropType } from 'react-native';

import productDataset from '../../product_dataset.json';

type JsonProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  image?: string;
  overview: string;
  nutrition: string[];
  highlights?: {
    icon: string;
    title: string;
  }[];
  source?: string;
  howToUse?: string;
  reviews?: string;
  images?: string[];
};

type JsonCategory = {
  id: string;
  name: string;
  slug: string;
  products: JsonProduct[];
};

export type DatasetProduct = Omit<JsonProduct, 'image' | 'nutrition'> & {
  image: ImageSourcePropType;
  categoryId: string;
  category: string;
  priceStartingFrom: string;
  nutrition: string;
  nutritionItems: string[];
  highlightTitles: string[];
  source: string;
  howToUse: string;
  reviews: string;
};

export type DatasetCategory = Omit<JsonCategory, 'products'> & {
  products: DatasetProduct[];
};

const productImages: Record<string, ImageSourcePropType> = {
  'src/assets/images/Chicken/breast.png': require('../assets/images/Chicken/breast.png'),
  'src/assets/images/Chicken/currycut.png': require('../assets/images/Chicken/currycut.png'),
  'src/assets/images/Chicken/dumpstick.png': require('../assets/images/Chicken/dumpstick.png'),
  'src/assets/images/Chicken/cubes.png': require('../assets/images/Chicken/cubes.png'),
  'src/assets/images/Chicken/wings.png': require('../assets/images/Chicken/wings.png'),
  'src/assets/images/Chicken/1.png': require('../assets/images/Chicken/1.png'),
  'src/assets/images/Chicken/mince.png': require('../assets/images/Chicken/mince.png'),
  'src/assets/images/Chicken/liver.png': require('../assets/images/Chicken/liver.png'),
  'src/assets/images/Chicken/sausage.png': require('../assets/images/Chicken/sausage.png'),
  'src/assets/images/Chicken/fillet.png': require('../assets/images/Chicken/fillet.png'),
  'src/assets/images/Soyabin/organic soya.png': require('../assets/images/Soyabin/organic soya.png'),
  'src/assets/images/Soyabin/soyachunks.png': require('../assets/images/Soyabin/soyachunks classic.png'),
  'src/assets/images/Soyabin/soyachunks classic.png': require('../assets/images/Soyabin/soyachunks classic.png'),
  'src/assets/images/Soyabin/mini soya.png': require('../assets/images/Soyabin/mini soya.png'),
  'src/assets/images/Soyabin/high protine.png': require('../assets/images/Soyabin/high protine.png'),
  'src/assets/images/Soyabin/soyanuts.png': require('../assets/images/Soyabin/soyanuts.png'),
  'src/assets/images/Soyabin/soya chaap.png': require('../assets/images/Soyabin/soya chaap.png'),
  'src/assets/images/Soyabin/flavourable.png': require('../assets/images/Soyabin/flavourable.png'),
  'src/assets/images/Soyabin/soyaPOwder.png': require('../assets/images/Soyabin/soyaPOwder.png'),
  'src/assets/images/Soyabin/cutlet.png': require('../assets/images/Soyabin/cutlet.png'),
  'src/assets/images/Soyabin/soyatikka.png': require('../assets/images/Soyabin/soyatikka.png'),
  'src/assets/images/Paneer/malai paneer.png': require('../assets/images/Paneer/malai paneer.png'),
  'src/assets/images/Paneer/fresh-milk-paneer.png': require('../assets/images/Paneer/fresh-milk-paneer.png'),
  'src/assets/images/Paneer/Low fat paneer.png': require('../assets/images/Paneer/Low fat panner.png'),
  'src/assets/images/Paneer/Low fat panner.png': require('../assets/images/Paneer/Low fat panner.png'),
  'src/assets/images/Paneer/masla paneer.png': require('../assets/images/Paneer/masla paneer.png'),
  'src/assets/images/Paneer/smoked paneer.png': require('../assets/images/Paneer/smoked paneer.png'),
  'src/assets/images/Paneer/herbed.png': require('../assets/images/Paneer/herbed.png'),
  'src/assets/images/Paneer/paneer fingers.png': require('../assets/images/Paneer/paneer fingers.png'),
  'src/assets/images/Paneer/cottage cheese.png': require('../assets/images/Paneer/cottage cheese.png'),
  'src/assets/images/Paneer/masala paneer.png': require('../assets/images/Paneer/masala paneer.png'),
  'src/assets/images/Paneer/Grilled stacks.png': require('../assets/images/Paneer/Grilled stacks.png'),
  'src/assets/images/Receipe/seekh kababs.png': require('../assets/images/Receipe/seekh kababs.png'),
  'src/assets/images/Receipe/crispy pops.png': require('../assets/images/Receipe/crispy pops.png'),
  'src/assets/images/Receipe/frozen chicken nuggets.png': require("../assets/images/Receipe/frozen chicken nuggets'.png"),
  "src/assets/images/Receipe/frozen chicken nuggets'.png": require("../assets/images/Receipe/frozen chicken nuggets'.png"),
  'src/assets/images/Receipe/Chicken Momos.png': require('../assets/images/Receipe/Chicken Momos.png'),
  'src/assets/images/Receipe/veg spring rolls.png': require('../assets/images/Receipe/veg spring rolls.png'),
  'src/assets/images/Receipe/Paneer tikka bites.png': require('../assets/images/Receipe/Paneer tikka bites.png'),
  'src/assets/images/Receipe/Cook  Cutlets.png': require('../assets/images/Receipe/Cook  Cutlets.png'),
  'src/assets/images/Receipe/Frozen paratha combo.png': require('../assets/images/Receipe/Frozen paratha combo.png'),
  'src/assets/images/Receipe/BBQ chicken.png': require('../assets/images/Receipe/BBQ chicken.png'),
  'src/assets/images/Receipe/pasta meals.png': require('../assets/images/Receipe/pasta meals.png'),
};

const fallbackImagesByCategory: Record<string, ImageSourcePropType> = {
  'cat-1': productImages['src/assets/images/Chicken/breast.png'],
  'cat-2': productImages['src/assets/images/Soyabin/organic soya.png'],
  'cat-3': productImages['src/assets/images/Paneer/malai paneer.png'],
  'cat-4': productImages['src/assets/images/Receipe/seekh kababs.png'],
};

const categories = productDataset.categories as JsonCategory[];

const getProductImage = (
  product: JsonProduct,
  fallbackImage: ImageSourcePropType,
) => {
  const jsonImage = product.images?.[0] || product.image;

  if (!jsonImage) {
    return fallbackImage;
  }

  if (/^https?:\/\//i.test(jsonImage)) {
    return { uri: jsonImage };
  }

  return productImages[jsonImage] || fallbackImage;
};

const getCategoryProducts = (categoryId: string): DatasetProduct[] => {
  const category = categories.find(item => item.id === categoryId);
  const fallbackImage =
    fallbackImagesByCategory[categoryId] ||
    productImages['src/assets/images/Chicken/breast.png'];

  if (!category) {
    return [];
  }

  return category.products.map(product => ({
    ...product,
    image: getProductImage(product, fallbackImage),
    categoryId: category.id,
    category: category.name,
    priceStartingFrom: product.price,
    nutrition: product.nutrition.join(', '),
    nutritionItems: product.nutrition,
    highlightTitles: product.highlights?.map(highlight => highlight.title) || [],
    source: product.source || category.name,
    howToUse:
      product.howToUse ||
      product.highlights?.map(highlight => highlight.title).join(', ') ||
      product.overview,
    reviews: product.reviews || 'Customer reviews will be available soon.',
  }));
};

export const cat1Products = getCategoryProducts('cat-1');
export const cat2Products = getCategoryProducts('cat-2');
export const productCategories: DatasetCategory[] = categories.map(category => ({
  ...category,
  products: getCategoryProducts(category.id),
}));
export const allDatasetProducts = productCategories.flatMap(
  category => category.products,
);

export const getDatasetProductById = (id: string) =>
  allDatasetProducts.find(product => product.id === id);
