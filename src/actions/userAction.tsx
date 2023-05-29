// src/actions/userAction.ts

import { AnyAction, Dispatch } from 'redux';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILURE,
  UPDATE_USER_DATA,
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAILURE,
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
import { UserResponse, getMyProfile, getUser, login, registerUser, updateUser, getNewAccessToken } from '../apiServices/authApi';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

// Action types
interface UserLoginRequestAction {
  type: typeof USER_LOGIN_REQUEST;
}

interface UserLoginSuccessAction {
  type: typeof USER_LOGIN_SUCCESS;
  payload: {
    accessToken: string;
    refreshToken: string;
    name:string;
    email:string;
    avatar:string;
  };
}

interface UserLoginFailureAction {
  type: typeof USER_LOGIN_FAILURE;
  payload: { error: string };
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT;
}

interface UserRegisterRequestAction {
  type: typeof USER_REGISTER_REQUEST;
}

interface UserRegisterSuccessAction {
  type: typeof USER_REGISTER_SUCCESS;
}

interface UserRegisterFailureAction {
  type: typeof USER_REGISTER_FAILURE;
  payload: { error: string };
}

interface UserGetRequestAction {
  type: typeof USER_GET_REQUEST;
}

interface UserGetSuccessAction {
  type: typeof USER_GET_SUCCESS;
  payload: UserResponse;
}

interface UserGetFailureAction {
  type: typeof USER_GET_FAILURE;
  payload: { error: string };
}

interface UpdateUserDataAction {
  type: typeof UPDATE_USER_DATA;
  payload: UserResponse;
}

interface UserProfileRequestAction {
  type: typeof USER_PROFILE_REQUEST;
}

interface UserProfileSuccessAction {
  type: typeof USER_PROFILE_SUCCESS;
  payload: UserResponse;
}

interface UserProfileFailureAction {
  type: typeof USER_PROFILE_FAILURE;
  payload: { error: string };
}

interface UserUpdateRequestAction {
  type: typeof UPDATE_USER_REQUEST;
}

interface UserUpdateSuccessAction {
  type: typeof UPDATE_USER_SUCCESS;
  payload: UserResponse;
}

interface UserUpdateFailureAction {
  type: typeof UPDATE_USER_FAILURE;
  payload: { error: string };
}
interface RefreshAccessTokenRequestAction {
  type: typeof REFRESH_ACCESS_TOKEN_REQUEST;
}
interface RefreshAccessTokenSuccessAction {
  type: typeof REFRESH_ACCESS_TOKEN_SUCCESS;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}
interface RefreshAccessTokenFailureAction {
  type: typeof REFRESH_ACCESS_TOKEN_FAILURE;
  payload: {
    error: string;
  };
}
export type UserAction =
  | UserLoginRequestAction
  | UserLoginSuccessAction
  | UserLoginFailureAction
  | UserLogoutAction
  | UserRegisterRequestAction
  | UserRegisterSuccessAction
  | UserRegisterFailureAction
  | UserGetRequestAction
  | UserGetSuccessAction
  | UserGetFailureAction
  | UpdateUserDataAction
  | UserProfileRequestAction
  | UserProfileSuccessAction
  | UserProfileFailureAction
  | UserUpdateRequestAction
  | UserUpdateSuccessAction
  | UserUpdateFailureAction
  | RefreshAccessTokenRequestAction
  | RefreshAccessTokenSuccessAction
  | RefreshAccessTokenFailureAction;

  export const loginAction = (email: string, password: string): ThunkAction<void, RootState, unknown, AnyAction> => async (
    dispatch: Dispatch<UserAction>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
      const response = await login(email, password);
      if (response && response.access_token && response.refresh_token) {
        const { access_token, refresh_token } = response;
        sessionStorage.setItem('accessToken', access_token);
        sessionStorage.setItem('refreshToken', refresh_token);
  
        // Retrieve the user data including name and avatar from the response or another API call
        const userData = await getMyProfile(); // Replace `fetchUserData` with the actual function that fetches the user data
  
        // Extract the name and avatar from the user data
        const { id,name,email, avatar } = userData;
  
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: {
            accessToken: access_token,
            refreshToken: refresh_token,
            name, // Store the user's name
            avatar, // Store the user's avatar
            id, // Store the user's id
            email, // Store the user's email
          },
        });
      } else {
        dispatch({ type: USER_LOGIN_FAILURE, payload: { error: 'Invalid credentials' } });
      }
    } catch (error) {
      dispatch({ type: USER_LOGIN_FAILURE, payload: { error: 'An error occurred' } });
    }
  };
  

export const logoutAction = (): UserLogoutAction => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  return { type: USER_LOGOUT };
};

export const registerAction = (
  userData: UserResponse,
  onSuccess: (userId: number) => void
): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const response = await registerUser(userData);
    userData.id = response.id;
    dispatch({ type: USER_REGISTER_SUCCESS });
    onSuccess(userData.id);
  } catch (error: any) {
    dispatch({ type: USER_REGISTER_FAILURE, payload: { error: error.message } });
  }
};

export const getUserAction = (
  userId: number
): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    dispatch({ type: USER_GET_REQUEST });
    const response = await getUser(userId);
    dispatch({ type: USER_GET_SUCCESS, payload: response });
  } catch (error: any) {
    dispatch({ type: USER_GET_FAILURE, payload: { error: error.message } });
  }
};

export const fetchUserProfile = (): ThunkAction<void, RootState, unknown, UserAction> => async (
  dispatch: Dispatch<UserAction>
) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    const response = await getMyProfile();
    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: response.data.myProfile,
    });
  } catch (error: any) {
    dispatch({
      type: USER_PROFILE_FAILURE,
      payload: error.message || 'Failed to fetch user profile',
    });
  }
};

export const updateUserDataAction = (
  userData: UserResponse,
  callback: () => void
): ThunkAction<void, RootState, unknown, UserAction> => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const response = await updateUser(userData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response });
    callback();
  } catch (error: any) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: { error: error.message } });
  }
};
export const refreshAccessTokenSuccess = (
  accessToken: string,
  refreshToken: string
): RefreshAccessTokenSuccessAction => ({
  type: REFRESH_ACCESS_TOKEN_SUCCESS,
  payload: {
    accessToken,
    refreshToken,
  },
});

export const refreshAccessTokenFailure = (error: string): RefreshAccessTokenFailureAction => ({
  type: REFRESH_ACCESS_TOKEN_FAILURE,
  payload: {
    error,
  },
});

export const refreshAccessTokenRequest = (): ThunkAction<void, RootState, unknown, UserAction> => async (
  dispatch: Dispatch<UserAction>
) => {
  try {
    dispatch({ type: REFRESH_ACCESS_TOKEN_REQUEST });

    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const newAccessToken = await getNewAccessToken(refreshToken);

    sessionStorage.setItem('accessToken', newAccessToken);

    dispatch(refreshAccessTokenSuccess(newAccessToken, refreshToken));
  } catch (error: any) {
    dispatch(refreshAccessTokenFailure(error.message + ' (Failed to refresh access token)'));
  }
};
