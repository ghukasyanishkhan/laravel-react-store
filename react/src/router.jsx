import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Users from "./views/Users.jsx";
import User from "./views/User.jsx";
import ProfileSettings from "./views/ProfileSettings.jsx";
import Item from "./views/Item.jsx";
import Items from "./views/Items.jsx";
import NotFound from "./views/NotFound.jsx";
import Home from "./layouts/Home.jsx";
import Guest from "./layouts/Guest.jsx";
import MyItems from "./views/MyItems.jsx";


const router = createBrowserRouter([
    // Home layout
    {
        path: '/home',
        element: <Home />,
        children: [
            {
                path: '',
                element: <Items />,
            },
            {
                path: 'users',
                element: <Users />,
            },
            {
                path: 'user',
                element: <User />,
            },
            {
                path: 'item',
                element: <Item />,
            },
            {
                path: 'items',
                element: <Items />,
            },
            {
                path: 'profile-settings',
                element: <ProfileSettings />,
            },
            {
                path: 'my-items',
                element: <MyItems/>
            },
        ]
    },

    // Guest layout
    {
        path: '/',
        element: <Guest />,
        children: [
            {
                path: '',
                element: <Items />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <Signup />,
            },
            {
                path: 'users',
                element: <Users />,
            },
            {
                path: 'user',
                element: <User />,
            },
            {
                path: 'item',
                element: <Item />,
            },
            {
                path: 'items',
                element: <Items />,
            },
        ]
    },

    // Not Found
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
