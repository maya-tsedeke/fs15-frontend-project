// authApi.ts
import axios, { AxiosResponse } from 'axios';

export const login = async (email: string, password: string) => {
  const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
    email,
    password,
  });
  return response.data;
};
export default login;

export interface UserResponse {
  email: string;
  password: string;
  name: string;
  avatar: string;
  role: string;
  id: number;
  accessToken: string; // Add the accessToken property
}

export const registerUser = async (userData: UserResponse): Promise<UserResponse> => {
  try {
    const response = await axios.post<UserResponse>('https://api.escuelajs.co/api/v1/users/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkEmailAvailability = async (email: string) => {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/users');
    const users = response.data;
    const existingUser = users.find((user: { email: string; }) => user.email === email);
    return !!existingUser; // Return true if the existingUser is found
  } catch (error) {
    throw new Error('Failed to check email existence');
  }
};

export const getUser = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await axios.get(`https://api.escuelajs.co/api/v1/users/${userId}`);
    return response.data as UserResponse;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};
// Get user profile by login session 
// Function to get the user profile
export const getMyProfile = async () => {
  const accessToken = sessionStorage.getItem('accessToken');
 
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
   
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
//Update a user if user is in admin user
export const updateUser = async (userData: UserResponse): Promise<UserResponse> => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  try {
    const { id, name, email } = userData; // Extract necessary properties
    const updatedUserData = { id, name, email }; // Create updated user data object
    const response = await axios.put<UserResponse>(`https://api.escuelajs.co/api/v1/users/${userData.id}`, updatedUserData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error:any) {
    throw new Error(error);
  }
};
// Get a new Access Token with a Refresh Token
export const getNewAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axios.post<{ access_token: string; refresh_token: string }>(
      'https://api.escuelajs.co/api/v1/auth/refresh-token',
      { refreshToken }
    );
    console.log("Token: ",response.data)
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};
