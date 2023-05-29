import { Dispatch } from 'redux';
import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from "../constants/productConstants";
import { RootState } from '../store';
import { Product } from "../types/productTypes";
import { ApiService } from '../apiServices/productApi';

export const getProductsAction = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch({ type: GET_PRODUCTS_REQUEST });

    const response = await ApiService.getProducts();
    dispatch({ type: GET_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error: any) {
    dispatch({ type: GET_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const getProductAction = (id: any) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch({ type: GET_PRODUCT_REQUEST });

    const response = await ApiService.getProduct(id);
    dispatch({ type: GET_PRODUCT_SUCCESS, payload: response });
  } catch (error: any) {
    dispatch({ type: GET_PRODUCT_FAILURE, payload: error.message });
  }
};

export const createProductAction = (product: Product) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const response = await ApiService.createProduct(product);
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: response });
  } catch (error: any) {
    dispatch({ type: CREATE_PRODUCT_FAILURE, payload: error.message });
  }
};

export const updateProductAction = (id: any, updates: Product) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const response = await ApiService.updateProduct(id, updates);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: response });
  } catch (error: any) {
    dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: error.message });
  }
};

export const deleteProductAction = (id: any) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    await ApiService.deleteProduct(id);
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: id });
  } catch (error: any) {
    dispatch({ type: DELETE_PRODUCT_FAILURE, payload: error.message });
  }
};
