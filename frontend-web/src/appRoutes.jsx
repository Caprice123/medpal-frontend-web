import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import Dashboard from '@routes/Dashboard';
import AdminPanel from '@routes/Admin/AdminPanel';
import ExerciseTopics from '@routes/ExerciseTopics';
import SessionDetail from '@routes/SessionDetail';
import ExerciseSession from '@routes/ExerciseSession';
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
    {
        path: '/exercise-topics',
        element: (
            <PrivateRoute>
                <ExerciseTopics />
            </PrivateRoute>
        )
    },
    {
        path: '/session/:sessionId',
        element: (
            <PrivateRoute>
                <SessionDetail />
            </PrivateRoute>
        )
    },
    {
        path: '/exercise-player/:sessionId',
        element: (
            <PrivateRoute>
                <ExerciseSession />
            </PrivateRoute>
        )
    },
];

export default appRoutes;
