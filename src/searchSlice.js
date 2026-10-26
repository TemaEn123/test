import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    article: '',
    brand: '',
  },
  reducers: {
    setArticle(state, action) {
      state.article = action.payload
      state.brand = ''
    },
    setBrand(state, action) {
      state.brand = action.payload
    },
  },
})

export const { setArticle, setBrand } = searchSlice.actions
export default searchSlice.reducer
