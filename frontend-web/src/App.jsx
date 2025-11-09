import { BrowserRouter as Router, Navigate, useRoutes, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from '@config/googleOAuth'
import appRoutes from './appRoutes'
import { useEffect } from 'react'
import { setupAxiosInterceptors } from './config/api'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'
import Middleware from '@middleware/Middleware'
import { GlobalStyles } from './theme/GlobalStyles'

const AxiosInterceptorSetup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        setupAxiosInterceptors(navigate, dispatch);
    }, [navigate, dispatch]);

    return null;
};

const AppRouter = () => useRoutes(appRoutes);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <Router>
                <AxiosInterceptorSetup />
                <Middleware />
                <AppRouter />
				<GlobalStyles />
			</Router>
        </Provider>
    </GoogleOAuthProvider>
  )
}

export default App
