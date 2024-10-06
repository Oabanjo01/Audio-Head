import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface AuthSliceTypes {
  verifiied: boolean;
  userData: any;
}

const initialState: AuthSliceTypes = {
  userData: null,
  verifiied: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<AuthSliceTypes>) {},
  },
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
export const userSelector = (state: RootState) => state.auth;
