import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axiosClient from '../axios-client.js';
import '../css/Users.css';

export default function Users() {



    const [isLoading, setIsLoading] = useState(false);
    const { setUser,setUsers,users,user } = useStateContext();


    const fetchUsers = ()=>{
        setIsLoading(true);
        axiosClient.get('/index')
            .then(({ data }) => {
                setUsers(data.users);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
    }
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
        if (users===null){
            fetchUsers();
        }
        if (user===null){
            fetchUser();
        }

    }, []);
    return (
        <div>
            {isLoading ? (
                <p className="loading-text">Loading...</p>
            ) : (
                <div className="users-container">
                    <div className='users-header'>
                        <h1>Users</h1>
                    </div>
                    {users?.map((user) => (
                        <Link
                            to={`/home/user`}
                            state={{user,items: user.items}}
                            key={user.id}
                            className="users-user"
                        >
                            <div>
                                <span>Name: {user.name} </span>
                                <span>Email: {user.email} </span>
                                <span>Items quantity: {user.items.length} </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
