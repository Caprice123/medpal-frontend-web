import Login from "../pages/Login";

export class AuthRoute {
    static signInRoute = "/sign-in"
}

export const loginRoutes = [
    { path: AuthRoute.signInRoute, element: <Login /> },
];
