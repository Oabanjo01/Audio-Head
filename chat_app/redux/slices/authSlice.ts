import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSliceState, UserData } from "root/constants/types/authTypes";

import { RootState } from "../store";

const initialState: AuthSliceState = {
  userData: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<UserData | null>) {
      state.userData = action.payload;
    },
    loading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { login, loading } = authSlice.actions;
export default authSlice.reducer;
export const getAuthState = (state: RootState) => state.auth;

// export const getAuthState = createSelector(
//   (state: RootState) => state.auth,
//   (state) => state
// );
