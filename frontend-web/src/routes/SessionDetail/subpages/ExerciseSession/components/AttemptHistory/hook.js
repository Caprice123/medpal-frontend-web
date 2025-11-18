import { useDispatch } from "react-redux"
import { createNewAttempt } from "../../../../../../store/session/action"
import { useParams } from "react-router-dom"
import { useState } from "react"

export const useAttemptHistory = (setSelectedAttempt) => {
    const dispatch = useDispatch()
    const { sessionId } = useParams()

    const [currentPage, setCurrentPage] = useState(1)

    const handleTryAgain = async () => {
        try {
            const newAttempt = await dispatch(createNewAttempt(sessionId))
            setSelectedAttempt(newAttempt.attempt)
        } catch (error) {
            alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
        }
    }

    return {
        currentPage,
        setCurrentPage,
        handleTryAgain,
    }
}