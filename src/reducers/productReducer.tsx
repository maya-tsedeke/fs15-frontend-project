import { AnyAction } from "redux";
import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCT_REQUEST,
  CREATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_REQUEST,
  DELETE_PRODUCT_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCT_FAILURE,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_FAILURE,
  GET_PRODUCT_SUCCESS,
  CREATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
} from "../constants/productConstants";
import { Product } from "../types/productTypes";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action: AnyAction): ProductState => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
    case GET_PRODUCT_REQUEST:
    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case GET_PRODUCTS_FAILURE:
    case GET_PRODUCT_FAILURE:
    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false,
        error: null,
      };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false,
        error: null,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        loading: false,
        error: null,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        loading: false,
        error: null,
      };
    //case SORT_PRODUCTS_BY_CATEGORY:
      // Implement sorting logic based on category
      //return state;
    //case SORT_PRODUCTS_BY_PRICE:
      // Implement sorting logic based on price
     // return state;
    default:
      return state;
  }
};

export default productReducer;
