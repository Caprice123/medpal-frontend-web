import Alert from '@components/Alert'
import { useResetState } from '../hooks/useResetState'

const Middleware = () => {
    const { loading } = useResetState()

    if (loading) {
        return <></>
    }

    return (
        <>
            <Alert />
        </>
    )
}

export default Middleware
