import { ImageSourcePropType } from 'react-native';

import productDataset from './product_dataset.json';

type JsonProduct = {
  id: string;
  name: string;
  priceStartingFrom: string;
  overview: string;
  nutrition: string;
  source: string;
  howToUse: string;
  reviews: string;
  images?: string[];
};

type JsonCategory = {
  id: string;
  category: string;
  products: JsonProduct[];
};

export type DatasetProduct = JsonProduct & {
  image: ImageSourcePropType;
  categoryId: string;
  category: string;
};

const chickenImages = [
  'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=700&q=85',
  'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=700&q=85',
  'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=700&q=85',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=700&q=85',
];

const soyaImages = [
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=85',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85',
];

const fallbackImagesByCategory: Record<string, string[]> = {
  'cat-1': chickenImages,
  'cat-2': soyaImages,
};

const categories = productDataset.categories as JsonCategory[];

const getProductImage = (
  product: JsonProduct,
  fallbackImages: string[],
  index: number,
) => {
  const jsonImage = product.images?.[0];
  const imageUri =
    jsonImage && /^https?:\/\//i.test(jsonImage)
      ? jsonImage
      : fallbackImages[index % fallbackImages.length];

  return { uri: imageUri };
};

const getCategoryProducts = (categoryId: string): DatasetProduct[] => {
  const category = categories.find(item => item.id === categoryId);
  const fallbackImages = fallbackImagesByCategory[categoryId] || chickenImages;

  if (!category) {
    return [];
  }

  return category.products.map((product, index) => ({
    ...product,
    image: getProductImage(product, fallbackImages, index),
    categoryId: category.id,
    category: category.category,
  }));
};

export const cat1Products = getCategoryProducts('cat-1');
export const cat2Products = getCategoryProducts('cat-2');
export const allDatasetProducts = categories.flatMap(category =>
  getCategoryProducts(category.id),
);

export const getDatasetProductById = (id: string) =>
  allDatasetProducts.find(product => product.id === id);
