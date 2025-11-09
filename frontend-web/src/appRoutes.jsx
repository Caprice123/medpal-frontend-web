import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import Dashboard from '@routes/Dashboard';
import AdminPanel from '@routes/Admin/AdminPanel';
import PrivateRoute from '@middleware/PrivateRoute';
import { AuthRoute } from './routes/Auth/routes';

const appRoutes = [
    { path: '/', element: <Home /> },
    { path: AuthRoute.signInRoute, element: <Login /> },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {
        path: '/admin',
        element: (
            <PrivateRoute>
                <AdminPanel />
            </PrivateRoute>
        )
    },
];

export default appRoutes;
