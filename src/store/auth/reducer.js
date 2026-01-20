import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {
        id: 0,
        name: "",
        email: "",
        roles: [],
        permissions: [],
    },
    loading: {
        isLoginLoading: false,
        isLogoutLoading: false
    },
}

const { reducer, actions } = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, { payload: { key, value } } ) => {
            state.loading[key] = value
        },
        setUser: (state, { payload: { data } } ) => {
            state.user = data
        },
    },
})

export { actions }
export default reducer
