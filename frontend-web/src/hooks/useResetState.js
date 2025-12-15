// hooks/useResetState.ts
import { resetAllState } from '@store/globalAction';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

export const useResetState = () => {
    const dispatch = useDispatch();
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        dispatch(resetAllState());
        setLoading(false)
    }, [dispatch, location.pathname]);

    return { loading }
};
