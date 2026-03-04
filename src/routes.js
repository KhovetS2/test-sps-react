import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Users from "./pages/Users";
import UserEdit from "./pages/UserEdit";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:userId",
        element: <UserEdit />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
