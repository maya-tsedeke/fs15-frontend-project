
//  ../../apiServices/productApi.tsx
import axios from 'axios';
import { Product } from '../types/productTypes';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

class ApiService {
  static async getProducts(offset = 0, limit = 1000) {
    try {
      const response = await axios.get(`${BASE_URL}/products/`);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  static async getProduct(id: any) {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
  static async createProduct(product: Product) {
    try {
      const response = await axios.post(`${BASE_URL}/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
  static async updateProduct(id: any, updates: Product) {
    try {
      const response = await axios.put(`${BASE_URL}/products/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }
  static async deleteProduct(id: any) {
    try {
      const response = await axios.delete(`${BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }
}
export { ApiService };