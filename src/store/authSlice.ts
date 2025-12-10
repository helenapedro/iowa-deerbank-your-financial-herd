import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/auth';
import { setAuthToken } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('deerbank_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Restore token from stored user
      if (user.token) {
        setAuthToken(user.token);
      }
      return user;
    }
    return null;
  } catch {
    localStorage.removeItem('deerbank_user');
    return null;
  }
};

const storedUser = getStoredUser();

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('deerbank_user', JSON.stringify(action.payload));
      // Set the auth token for API calls
      if (action.payload.token) {
        setAuthToken(action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('deerbank_user');
      setAuthToken(null);
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem('deerbank_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setLoading, login, logout, updateBalance } = authSlice.actions;
export default authSlice.reducer;
