export type Product = {
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
  id: number;
  creationAt: string;
  updatedAt: string;
};
export type Category = {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};
// Define the type for user object
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};