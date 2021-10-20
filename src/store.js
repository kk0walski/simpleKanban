import { configureStore } from '@reduxjs/toolkit'
import { boardApi } from './services/board'

export const store = configureStore({
    reducer: {
        [boardApi.reducerPath]: boardApi.reducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(boardApi.middleware)
})