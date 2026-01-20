import { useEffect } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { fetchUsers } from "../../../../store/user/action"
import { useUserDetail } from "./subhooks/useUserDetail"

export const useUserSection = () => {
    const [uiState, setUiState] = useState({
        isUserDetailModalOpen: false
    })
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return {
        uiState,
        setUiState,
        useUserDetail: useUserDetail(setUiState),
    }
}