import { configureStore } from '@reduxjs/toolkit'
import { partsApi } from './api'
import searchReducer from './searchSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    [partsApi.reducerPath]: partsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(partsApi.middleware),
})
