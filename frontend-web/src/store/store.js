import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {useSelector, useDispatch } from 'react-redux';
import auth from "./auth";
import common from "./common";
import credit from "./credit";

export const rootReducer = combineReducers({
    auth,
    common,
    credit,
})

export const store = configureStore({
    reducer: rootReducer
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export default store
