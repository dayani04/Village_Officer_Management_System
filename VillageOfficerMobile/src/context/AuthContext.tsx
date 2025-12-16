import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, AuthState } from '@/src/types/auth';

// API imports
import * as villagerApi from '@/src/api/villager';
import * as villageOfficerApi from '@/src/api/villageOfficer';
import * as secretaryApi from '@/src/api/secretary';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials & { position: string }) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  const login = async (credentials: LoginCredentials & { position: string }) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      let response;
      
      if (credentials.position === 'developer') {
        response = await villagerApi.loginVillager(credentials.email, credentials.password);
      } else if (credentials.position === 'manager') {
        response = await villageOfficerApi.loginVillageOfficer(credentials.email, credentials.password);
      } else if (credentials.position === 'designer') {
        response = await secretaryApi.loginSecretary(credentials.email, credentials.password);
      } else {
        throw new Error('Invalid position selected');
      }
      
      if (response && response.token) {
        const user: User = {
          id: response.id || response._id || '1',
          name: response.full_name || response.name || 'User',
          email: response.email || credentials.email,
          role: credentials.position === 'developer' ? 'user' : 
                credentials.position === 'manager' ? 'village_officer' : 'secretary',
          profileImage: response.profileImage,
        };
        
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
        await AsyncStorage.setItem('user_position', credentials.position);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: response.token },
        });
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      await AsyncStorage.removeItem('user_position');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: any) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'user',
      };
      
      const mockToken = 'mock_jwt_token';
      
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
    } catch (error) {
      console.error('Register error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const updateUser = (user: User) => {
    AsyncStorage.setItem('auth_user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
