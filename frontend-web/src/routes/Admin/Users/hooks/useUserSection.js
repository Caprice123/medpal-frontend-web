import { useEffect } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { fetchUsers } from "../../../../store/user/action"
import { useAdjustCredit } from "./subhooks/useAdjustCredit"
import { useAdjustSubscription } from "./subhooks/useAdjustSubscription"

export const useUserSection = () => {
    const [uiState, setUiState] = useState({
        isCreditActionPopupOpen: false,
        isSubscriptionActionPopupOpen: false
    })
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return {
        uiState,
        setUiState,
        useAdjustCredit: useAdjustCredit(setUiState),
        useAdjustSubscription: useAdjustSubscription(setUiState),
    }
}