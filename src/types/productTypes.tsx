export interface Product {
  id: number;
  title: string;
  description: string;
  images?: string[];
  price: number;
  category: {
    id: number;
    name: string;
    image: string;
  };
}
