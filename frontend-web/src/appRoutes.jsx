import Login from '@routes/Auth/pages/Login';
import { AuthRoute } from './routes/Auth/routes';

const appRoutes = [
    { path: AuthRoute.signInRoute, element: <Login /> },
    // { path: routes.LOGOUT, element: <Logout /> },
    // {
    //     path: routes.ROOT,
    //     element: <PrivateRoutes />,
    //     children: [
    //         // DOING THIS SO THAT IT IS DEFAULT TO SHOW NOTIFICATION
    //         { path: routes.ROOT, element: <NotificationList /> },

    //         ...userRoutes,
    //         ...bankRoutes,
    //         ...remittingBankRoutes,
    //         ...vendorRoutes,
    //         ...regionRoutes,
    //         ...permissionRoutes,
    //         ...locationRoutes,
    //         ...chartOfAccountRoutes,
    //         ...fundRequestRoutes,
    //         ...notificationRoutes,
    //         ...exportRequestRoutes,
    //     ],
    // },
];

export default appRoutes;
