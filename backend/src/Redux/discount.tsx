import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { getConfig } from "../../utils";

interface Discount {
  _id: string;
  startingPrice: number;
  endingPrice: number;
  discountPercentage: number;
}

interface DiscountState {
  isLoading: boolean;
  error: string | null;
  discounts: Discount[];
  discount: Discount | null;
}

const initialState: DiscountState = {
  isLoading: false,
  error: null,
  discounts: [],
  discount: null,
};

// Async thunks for discount operations
export const createDiscount = createAsyncThunk(
  "discounts/create",
  async (discountData: Partial<Discount>, thunkAPI) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/api/v1/discount`, discountData, getConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create discount");
    }
  }
);

export const getDiscounts = createAsyncThunk(
  "discounts/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/discount`, getConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch discounts");
    }
  }
);

export const getDiscountById = createAsyncThunk(
  "discounts/getById",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/discount/${id}`, getConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch discount");
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "discounts/update",
  async ({ id, discountData }: { id: string; discountData: Partial<Discount> }, thunkAPI) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/api/v1/discount/${id}`, discountData, getConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update discount");
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "discounts/delete",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/api/v1/discount/${id}`, getConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete discount");
    }
  }
);

// Create the discount slice
const discountSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.isLoading = false;
        state.discounts.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getDiscounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDiscounts.fulfilled, (state, action: PayloadAction<Discount[]>) => {
        state.isLoading = false;
        state.discounts = action.payload;
      })
      .addCase(getDiscounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getDiscountById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDiscountById.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.isLoading = false;
        state.discount = action.payload;
      })
      .addCase(getDiscountById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.isLoading = false;
        const index = state.discounts.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action: PayloadAction<Discount>) => {
        state.isLoading = false;
        state.discounts = state.discounts.filter(d => d._id !== action.payload._id);
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default discountSlice.reducer;
