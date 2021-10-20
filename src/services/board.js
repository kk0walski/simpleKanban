import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const boardApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://0.0.0.0:5000/api/' }),
    tagTypes: ['Board', 'List', 'Card'],
    endpoints: (build) => ({
        getBoard: build.query({
            query: () => 'board',
            providesTags: (result, error, arg) => result ? [...result.map(({ id }) => ({ type: 'Board', id })), 'Board'] : ['Board']
        }),
        moveList: build.mutation({
            query: (action) => ({
                url: 'board',
                method: 'PUT',
                body: action
            }),
            invalidatesTags: ['Board']
        }),
        getLists: build.query({
            query: () => 'lists',
            providesTags: (result, error, arg) => result ? [Object.keys(result).map((key, index) => ({ type: 'List', id: key, title: result[key]['title'], cards: result[key]['cards'] })), 'List'] : ['List']
        }),
        addList: build.mutation({
            query: (action) => ({
                url: 'lists',
                method: 'POST',
                body: action
            }),
            invalidatesTags: ['Board', 'List']
        }),
        editList: build.mutation({
            query: (action) => ({
                url: `lists/${action.payload.id}`,
                method: 'PUT',
                body: action
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'List', id: arg.id }],
        }),
        moveCard: build.mutation({
            query: (action) => ({
                url: `lists`,
                method: 'PUT',
                body: action
            }),
            invalidatesTags: ['List'],
        }),
        deleteList: build.mutation({
            query: (action) => ({
                url: `lists/${action.payload.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => ['Board', 'Card', { type: 'List', id: arg.id }],
        }),
        getCards: build.query({
            query: () => 'cards',
            providesTags: (result, error, arg) => result ? [Object.keys(result).map((key, index) => ({ type: 'Card', id: key, title: result[key]['title'], content: result[key]['content'] })), 'Card'] : ['Card']
        }),
        addCard: build.mutation({
            query: (action) => ({
                url: `lists/${action.payload.listId}`,
                method: 'POST',
                body: action
            }),
            invalidatesTags: (result, error, arg) => ['Card', { type: 'List', id: arg.id }],
        }),
        editCard: build.mutation({
            query: (action) => ({
                url: `cards/${action.payload.id}`,
                method: 'PUT',
                body: action
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Card', id: arg.id }],
        }),
        deleteCard: build.mutation({
            query: (action) => ({
                url: `lists/${action.payload.listId}/${action.payload.id}`,
                method: 'DELETE',
                body: action
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'List', id: arg.listId }, { type: 'Card', id: arg.id }],
        })
    }),
})

export const {
    useGetBoardQuery,
    useGetListsQuery,
    useAddListMutation,
    useMoveListMutation,
    useDeleteCardMutation,
    useEditListMutation,
    useMoveCardMutation,
    useDeleteListMutation,
    useGetCardsQuery,
    useAddCardMutation,
    useEditCardMutation,
} = boardApi;