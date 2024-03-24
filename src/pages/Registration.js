import React, { useState, useEffect } from 'react';
import LoginForm from '../components/loginForm';
import RegisterForm from '../components/registerForm';
import FormCard from '../components/formCard';

import http from '../services/httpService';
import '../components/registration.css';

let backendURL = process.env.REACT_APP_API_URL;

const Registration = (props) => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isRegisterForm, setIsRegisterForm] = useState(false);
    const [majors, setMajors] = useState([]);

    const handleLoginSwape = () => {
        setIsLoginForm(false);
        setIsRegisterForm(true);
    };
    const handleRegisterSwape = () => {
        setIsLoginForm(true);
        setIsRegisterForm(false);
    };

    useEffect(() => {
        fetchMajors();
    }, []);

    const fetchMajors = async () => {
        const { data } = await http.get(`${backendURL}/api/courses/majors`);
        setMajors(data);
    };
    return (
        <div className="cont">
            <div
                className={isLoginForm ? 'contain' : 'contain contain-register'}
                id="container"
            >
                <div className="form-container">
                    {isLoginForm && (
                        <>
                            <LoginForm {...props} majors={majors} />
                            <FormCard
                                title="Create Account"
                                handleFormSwape={handleLoginSwape}
                            />
                        </>
                    )}
                    {isRegisterForm && (
                        <>
                            <FormCard
                                title="Sign in"
                                handleFormSwape={handleRegisterSwape}
                            />
                            <RegisterForm majors={majors} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Registration;
