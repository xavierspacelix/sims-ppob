import { RootState } from "@/lib/srote";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
  isAuthenticated: boolean;
}
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const initialState: AuthState = {
  user: null,
  token: sessionStorage.getItem("token") || null,
  status: "idle",
  error: null,
  successMessage: null,
  isAuthenticated: !!sessionStorage.getItem("token"),
};
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, credentials);
      if (response.data.status === 0) {
        const token = response.data.data.token;
        const userDetail = await dispatch(fetchUserDetails(token));

        dispatch(loginSuccess({ user: userDetail.payload, token }));
        return token;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    newUser: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/registration`, newUser);
      if (response.data.status === 0) {
        return response.data.message;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    profileData: { first_name: string; last_name: string },
    { rejectWithValue, getState }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const response = await axios.put(
        `${apiUrl}/profile/update`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 0) {
        toast.success("Profile berhasil diperbarui!");
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "profile/uploadImage",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 0) {
        toast.success("Foto Profile berhasil diubah");
        return response.data;
      } else {
        return rejectWithValue("Gagal mengunggah gambar");
      }
    } catch (error) {
      return rejectWithValue("Terjadi kesalahan saat mengunggah gambar");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      sessionStorage.setItem("token", action.payload.token);
      toast.success("Login Berhasil");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
    },
    resetMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isAuthenticated = true;
        state.successMessage = "Login Sukses";
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { loginSuccess, logout, resetMessages } = authSlice.actions;
export default authSlice.reducer;
