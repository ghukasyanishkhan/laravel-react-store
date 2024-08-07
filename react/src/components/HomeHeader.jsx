import { Link, useLocation } from 'react-router-dom';
import '../css/header.css';
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useState } from "react";
import axiosClient from "../axios-client.js";
import Search from "./Search.jsx";

export default function HomeHeader() {
    const { user, setToken, setUser, token } = useStateContext();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    const onLogout = () => {
        axiosClient.post('/logout')
            .then(({ data }) => {
                localStorage.removeItem('ACCESS_TOKEN');
                setToken(null);
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className='header'>
            <Link to='/'>
                <img
                    src='https://static.vecteezy.com/system/resources/thumbnails/008/075/444/small_2x/the-logo-of-home-housing-residents-real-estate-with-a-concept-that-presents-rural-nature-with-a-touch-of-leaves-and-sunflowers-vector.jpg'
                    alt='Logo'/>
            </Link>
            <div className='header-links'>
                <Link to='/home/my-items' className={`link item-link ${currentPath === '/home/my-items' ? 'active' : ''}`}>My Items</Link>
                <Link to='/home/items' className={`link item-link ${currentPath === '/home/items' ? 'active' : ''}`}>Items</Link>
                <Link to='/home/users' className={`link user-link ${currentPath === '/home/users' ? 'active' : ''}`}>Users</Link>
                <Search />
                <div className='user-menu'>
                    <button className='username-button' onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                        {user?.name}
                    </button>
                    {isDropdownVisible &&
                        <div className='dropdown-menu'>
                            <button onClick={onLogout}>Logout</button>
                            <Link to="/home/profile-settings">Profile Settings</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
