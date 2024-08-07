import '../css/Signup.css';
import {useRef, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function Signup() {
    const nameRef = useRef(); // Correctly invoke useRef here
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const {setToken, setUser} = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (evt) => {
        evt.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmRef.current.value,
        };
        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                setErrors(err.response?.data?.errors || {});
                console.log(err);
            });
    };

    return (
        <div className='signup'>
            <h1>Sign up</h1>
            <form className='signup-form' onSubmit={onSubmit}>
                <input ref={nameRef} type='text' name='name' placeholder='Full Name'/>
                {errors?.name && <p className='field-error'>{errors.name}</p>}
                <input ref={emailRef} type='email' name='email' placeholder='Email'/>
                {errors?.email && <p className='field-error'>{errors.email}</p>}
                <input ref={passwordRef} type='password' name='password' placeholder='Password'/>
                {errors?.password && <p className='field-error'>{errors.password}</p>}
                <input ref={passwordConfirmRef} type='password' name='confirm-password' placeholder='Confirm Password'/>
                <button type='submit'>Submit</button>
                <p>Already Registered?<Link to='/login'> Sign in</Link></p>
            </form>
        </div>
    );
}
