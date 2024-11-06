import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BalanceState {
  balance: number | null;
  loading: boolean;
  error: string | null;
  status: string | null;
}

const initialState: BalanceState = {
  balance: null,
  loading: false,
  error: null,
  status: "idle",
};
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchBalance = createAsyncThunk(
  "balance/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue("Token tidak valid atau kadaluwarsa");
      }
      return rejectWithValue("Terjadi kesalahan");
    }
  }
);
export const topUpBalance = createAsyncThunk(
  "balance/topUp",
  async (topUpAmount: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/topup`,
        { top_up_amount: topUpAmount },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Terjadi kesalahan saat melakukan top-up");
    }
  }
);
const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.data.balance;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(topUpBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(topUpBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(topUpBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default balanceSlice.reducer;
