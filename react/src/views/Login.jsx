import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import '../css/Login.css';

export default function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const {setUser, setToken, token, user} = useStateContext()
    const [errors, setErrors] = useState();

    const onSubmit = (evt) => {
        evt.preventDefault()
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmRef.current.value
        }
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setErrors(data)
                setUser(data.user);
                setToken(data.token)

            })
            .catch((err) => {
                setErrors(err.response?.data?.errors || {});
            })
    }


    return (
        <div className='login'>
            <h1>Login into your account</h1>
            <form onSubmit={onSubmit}>
                <input ref={emailRef} type='email' name='email' placeholder='Email'/>
                {errors?.email && <p className='field-error'>{errors.email}</p>}
                <input ref={passwordRef} type='password' name='password' placeholder='Password'/>
                {errors?.password && <p className='field-error'>{errors.password}</p>}
                {errors?.message && <p className='field-error'>{errors?.message}</p>}
                <input ref={passwordConfirmRef} type='password' name='confirm-password' placeholder='Confirm Password'/>
                <button type='submit'>Submit</button>
                <p>Not Registered?<Link to='/signup'>Create an account</Link></p>
            </form>
        </div>
    );
}
