// store.js

import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
  ref: false,
};

const valueSlice = createSlice({
  name: "value",
  initialState,
  reducers: {
    setValue(state, action) {
      state.value = action.payload;
    },
  },
});
const refSlice = createSlice({
  name: "value",
  initialState,
  reducers: {
    setRef(state, action) {
      state.ref = action.payload;
    },
  },
});

export const { setValue } = valueSlice.actions;
export const { setRef } = refSlice.actions;
export const authActions = valueSlice.action;

const store = configureStore({
  reducer: {
    value: valueSlice.reducer,
    ref: refSlice.reducer,
  },
});

export default store;
