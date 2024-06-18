import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { getConfig } from "../../utils";

interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  token: string; 
  user: object; 
}

interface RegisterRequest {
  username: string;
  email: string; 
  password: string;
}

interface RegisterResponse {
  message: string; 
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
  token: string | null;
  user: object | null; 
}

const initialState: AuthState = {
  isLoading: false,
  error: null,   
  token: null,
  user: null,
};

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.API_URL}/api/v1/admin/login-admin`,
        credentials,
        getConfig()
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Login failed. Please check your credentials.");
    }
  }
);

export const register = createAsyncThunk<RegisterResponse, RegisterRequest>(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${process.env.API_URL}/api/v1/admin/register-admin`,
        userData,
        getConfig()
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Registration failed. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear auth state on logout
      state.isLoading = false;
      state.error = null;
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
