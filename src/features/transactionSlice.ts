import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface TransactionState {
  records: any[];
  data: any | null;
  loading: boolean;
  error: string | null;
  offset: number;
  limit: number;
}

const initialState: TransactionState = {
  records: [],
  data: null,
  loading: false,
  error: null,
  offset: 0,
  limit: 5,
};
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const getTransactionHistory = createAsyncThunk(
  "transaction/history",
  async (
    { offset, limit }: { offset: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${apiUrl}/transaction/history`, {
        params: { offset, limit },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (response.data.status === 0) {
        return response.data.data.records;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(
        "Terjadi kesalahan saat mengambil riwayat transaksi"
      );
    }
  }
);
export const makeTransaction = createAsyncThunk(
  "transaction/make",
  async (service_code: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/transaction`,
        { service_code },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue("Terjadi kesalahan saat memproses transaksi");
    }
  }
);
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearHistoryRecords: (state) => {
      state.records = [];
    },

    increaseOffset(state) {
      state.offset += state.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(makeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [...state.records, ...action.payload];
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { increaseOffset, clearHistoryRecords } = transactionSlice.actions;
export default transactionSlice.reducer;
