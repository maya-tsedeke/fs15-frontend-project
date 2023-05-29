import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILURE,
  USER_GET_SUCCESS,
  USER_GET_FAILURE,
  UPDATE_USER_DATA,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  REFRESH_ACCESS_TOKEN_REQUEST,
  REFRESH_ACCESS_TOKEN_SUCCESS,
  REFRESH_ACCESS_TOKEN_FAILURE,
} from '../constants/userConstants';
import { UserAction } from '../actions/userAction';
import { UserResponse } from '../apiServices/authApi';

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userData: UserResponse | null;
  id: string | null; // Store the user's name
  name: string | null; // Store the user's avatar
  email: string | null; // Store the user's name
  avatar: string | null; // Store the user's avatar
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  accessToken: null,
  refreshToken: null,
  userData: null,
  id: null,
  name: null,
  email: null,
  avatar: null
};

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        name:action.payload.name,
        email:action.payload.email,
        avatar:action.payload.avatar,
      };
    case USER_LOGIN_FAILURE:
      return { 
        ...state, 
        loading: false, 
        success: false, 
        error: action.payload.error,  
        name:null,    
        email:null, 
        avatar:null};
    case USER_LOGOUT:
      return { ...state, accessToken: null, refreshToken: null };
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null, success: false, accessToken: null, refreshToken: null };
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        accessToken: null,
        refreshToken: null,
      };
    case USER_REGISTER_FAILURE:
      return { ...state, loading: false, success: false, error: action.payload.error };
    case USER_GET_SUCCESS:
      return { ...state, loading: false, success: true, userData: action.payload };
    case USER_GET_FAILURE:
      return { ...state, loading: false, success: false, error: action.payload.error };
    case UPDATE_USER_DATA:
      return { ...state, userData: action.payload };
    case USER_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        userData: action.payload,
      };
    case USER_PROFILE_FAILURE:
      return { ...state, loading: false, success: false, error: action.payload.error };
    case UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        userData: action.payload,
      };
    case UPDATE_USER_FAILURE:
      return { ...state, loading: false, success: false, error: action.payload.error };
    case REFRESH_ACCESS_TOKEN_REQUEST:
      return { ...state, loading: true, error: null };
    case REFRESH_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case REFRESH_ACCESS_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default userReducer;
