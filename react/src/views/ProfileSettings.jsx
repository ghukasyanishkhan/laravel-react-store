import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect, useRef, useState} from "react";
import '../css/Profile-settings.css'
import axiosClient from "../axios-client.js";
import {Navigate, useNavigate} from "react-router-dom";

export default function ProfileSettings() {
    const {user, setUser, setToken, message, setMessage} = useStateContext()
    const [errors, setErrors] = useState(null)
    const navigate=useNavigate()

    const nameRef = useRef();
    const emailRef = useRef();
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();

    const onUpdate = (evt) => {
        evt.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            old_password: oldPasswordRef.current.value,
            new_password: newPasswordRef.current.value,
        }
        axiosClient.patch('/user', payload)
            .then((response) => {
                console.log(response)
                setMessage(response.data.success);
                navigate('/home/items');
            })
            .catch((error) => {
                setErrors(error.response?.data?.errors || {});
                console.log(error)
            })
    }
    const onDelete = (evt) => {
        const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
        if (confirmDelete) {
            axiosClient.delete('/user')
                .then((response) => {
                    setUser(null);
                    setToken(null)
                    localStorage.removeItem('ACCESS_TOKEN')
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
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
        if (user===null){
            fetchUser();
        }
    }, []);

    return (
        <div>
            <div className='settings-header'>
                <h1>Profile Settings</h1>
            </div>

            <div className='update-profile-form'>
                <form onSubmit={onUpdate}>
                    <h2>Update Profile</h2>
                    <label>
                        <b>Name</b>
                        <input ref={nameRef} type='text' defaultValue={user?.name}/>
                        {errors?.name && <p className='field-error'>{errors?.name}</p>}
                    </label>
                    <label>
                        <b>Email</b>
                        <input ref={emailRef} type='email' defaultValue={user?.email}/>
                        {errors?.email && <p className='field-error'>{errors?.email}</p>}
                    </label>
                    <label>
                        <b>Old Password</b>
                        <input ref={oldPasswordRef} type='password'/>
                        {errors?.old_password && <p className='field-error'>{errors?.old_password}</p>}
                    </label>
                    <label>
                        <b>New Password</b>
                        <input ref={newPasswordRef} type='password'/>
                        {errors?.new_password && <p className='field-error'>{errors?.new_password}</p>}
                    </label>

                    <button type='submit'>Submit</button>
                </form>
                <button onClick={onDelete} className='delete-profile-btn'>Delete Profile</button>
            </div>

        </div>
    );
}
