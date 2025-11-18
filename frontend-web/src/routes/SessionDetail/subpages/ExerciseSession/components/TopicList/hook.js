import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchExerciseTopics } from '@store/exercise/action'
import { useNavigate, useParams } from "react-router-dom"
import { fetchSessionAttempts, startExerciseWithTopic } from "../../../../../../store/session/action"

export const useTopicList = () => {
    const [filters, setFilters] = useState({
        university: '',
        semester: ''
    })
    
    const { balance } = useSelector(state => state.credit)
    const { sessionAttempts: attempts } = useSelector(state => state.session)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { sessionId } = useParams()

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
          ...prev,
          [filterType]: value
        }))
        dispatch(fetchExerciseTopics({ [filterType]: value }))
    }

    const handleStartTopic = async (topic) => {
        if (balance < topic.cost) {
          alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
          navigate('/dashboard')
          return
        }

        const notStartedAttempt = attempts.find(a => a.status === 'not_started')
        if (notStartedAttempt) {
            await dispatch(startExerciseWithTopic(sessionId, notStartedAttempt.id, topic.id))
            // Refresh attempts to get updated status
            await dispatch(fetchSessionAttempts(sessionId))
        }
      }

    return {
        filters,
        handleFilterChange,
        handleStartTopic,
    }
}