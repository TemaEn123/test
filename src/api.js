import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { normalizeGoods, normalizeOffers } from './format'

export const API_KEY = import.meta.env.VITE_API_KEY || '00000000-0000-0000-0000-000000000001'

export const partsApi = createApi({
  reducerPath: 'partsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://api.favorit-parts.ru/hs/hsprice/',
    timeout: 20000,
  }),
  endpoints: (builder) => ({
    getManufacturers: builder.query({
      query: (number) => ({
        url: '',
        params: {
          key: API_KEY,
          number,
        },
      }),
      transformResponse: normalizeGoods,
    }),
    getOffers: builder.query({
      query: ({ number, brand }) => ({
        url: '',
        params: {
          key: API_KEY,
          number,
          brand,
          analogues: 'on',
        },
      }),
      transformResponse: normalizeOffers,
    }),
  }),
})

export const { useGetManufacturersQuery, useGetOffersQuery } = partsApi
