// Redux store entry point
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Dummy slice to satisfy Redux until auth is implemented
const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: 'system' },
  reducers: {},
});

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
