import {useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import axiosClient from '../axios-client.js';
import {useStateContext} from '../contexts/ContextProvider.jsx';
import '../css/User.css';

export default function User() {
    const location = useLocation();
    const {user, items} = location.state || {};
    const {setUser} = useStateContext();
    const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

    const fetchUser=()=>{
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data.user);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (user===null){
            fetchUser();
        }
    }, [setUser]);

    return (
        <div>
            <div className='user-header'>
                <h1>User Details</h1>
            </div>

            <div className='user-container'>

                <div className='user-info'>
                    <p className='user-name'>Name: {user?.name}</p>
                    <p className='user-email'>Email: {user?.email}</p>
                </div>
                <div className='user-items'>
                    {items?.length ? (
                        items.map(item => (
                            <div key={item.name} className='item-card'>
                                <img
                                    src={item.image_path ? `${IMG_BASE_URL}/${item.image_path}` : 'default-image-url'}
                                    alt={item.name}
                                    className='item-image'
                                />
                                <div className='item-details'>
                                    <h3 className='item-name'><b>Name:</b> {item.name}</h3>
                                    <p className='item-description'><b>Description:</b> {item.description}</p>
                                    <p className='item-views'>Views: {item.views}</p>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p>No items.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
