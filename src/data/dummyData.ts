export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  weight: string;
  price: string;
  memberPrice: string;
  image: string;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const categories: Category[] = [
  {id: 'fresh', name: 'Fresh Chicken', icon: 'food-drumstick'},
  {id: 'boneless', name: 'Boneless', icon: 'food-steak'},
  {id: 'eggs', name: 'Eggs', icon: 'egg'},
  {id: 'spices', name: 'Spices', icon: 'shaker-outline'},
  {id: 'offers', name: 'Offers', icon: 'tag-heart'},
];

export const products: Product[] = [
  {
    id: 'whole-chicken',
    name: 'Whole Chicken',
    weight: '900 g - 1.1 kg',
    price: '₹249',
    memberPrice: 'Member ₹229',
    image:
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'breast',
    name: 'Chicken Breast',
    weight: '500 g',
    price: '₹189',
    memberPrice: 'Member ₹169',
    image:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'legs',
    name: 'Chicken Legs',
    weight: '500 g',
    price: '₹159',
    memberPrice: 'Member ₹145',
    image:
      'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80',
  },
];

export const features: Feature[] = [
  {
    id: 'clean',
    title: 'Clean Cuts',
    description: 'Freshly processed and neatly packed.',
    icon: 'knife',
  },
  {
    id: 'delivery',
    title: 'Fast Delivery',
    description: 'Delivered quickly to your doorstep.',
    icon: 'bike-fast',
  },
  {
    id: 'quality',
    title: 'Quality First',
    description: 'Daily stock from trusted suppliers.',
    icon: 'shield-check',
  },
];
