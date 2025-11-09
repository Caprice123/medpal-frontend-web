import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    error: undefined
}

const { reducer, actions } = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setError: (state, { payload } ) => {
            state.error = payload
        },
        resetError: (state) => {
            state.error = initialState.error
        }
    },
})

export { actions }
export default reducer
