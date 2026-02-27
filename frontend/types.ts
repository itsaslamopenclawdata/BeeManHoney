export interface Product {
  id: number;
  name: string;
  price: number; // In INR
  image: string;
  description?: string;
  category: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Shipped' | 'Processing';
}