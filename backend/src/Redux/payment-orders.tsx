import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { getConfig } from "../../utils";

interface Order {
    _id: string;
    user: string; 
    totalAmount: number;
    status: string;
    items: any[];
    payment: string,
    shippingAddress: string,
    orderId: string,
    billNo: string,
    totalPayAmount: number,
    totalBV: number,
    createdAt: string,
    updatedAt: string,
    voucher: string 
}

interface Payment {
    _id: string;
    transactionId: string;
    user: {
      username: string;
      email: string;
      mfvUser: boolean;
    };
    date: string;
    method: string;
    status: string;
    amount: number;
  }

interface CombinedState {
    isLoading: boolean;
    error: string | null;
    orders: Order[];
    payments: Payment[];
}

const initialState: CombinedState = {
    isLoading: false,
    error: null,
    orders: [],
    payments: [],
};


export const getOrders = createAsyncThunk(
    "combined/getOrders",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/v1/admin/orders`, getConfig());
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const getPayments = createAsyncThunk(
    "combined/getPayments",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/v1/admin/payments`, getConfig());
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
        }
    }
);

const combinedSlice = createSlice({
    name: "combined",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Orders
            .addCase(getOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get Payments
            .addCase(getPayments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
                state.isLoading = false;
                state.payments = action.payload;
            })
            .addCase(getPayments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default combinedSlice.reducer;


