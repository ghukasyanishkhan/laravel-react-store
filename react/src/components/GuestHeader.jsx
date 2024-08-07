import {Link} from 'react-router-dom';
import '../css/header.css';
import Search from "./Search.jsx";

export default function GuestHeader() {
    return (
        <div className='header'>
            <Link to='/'>
                <img
                    src='https://static.vecteezy.com/system/resources/thumbnails/008/075/444/small_2x/the-logo-of-home-housing-residents-real-estate-with-a-concept-that-presents-rural-nature-with-a-touch-of-leaves-and-sunflowers-vector.jpg'
                    alt='Logo'/>
            </Link>
            <div className='header-links'>
                <Link to='/items' className='link item-link'>Items</Link>
                <Link to='/users' className='link user-link'>Users</Link>
                <Search/>
                <div>
                    <Link to='/login' className='link'>Login</Link>
                    <Link to='/signup' className='link'>Signup</Link>
                </div>
            </div>
        </div>
    );
}
