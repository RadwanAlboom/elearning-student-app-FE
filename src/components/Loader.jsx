import React from 'react';
import logo from '../assets/logo.png';

const Loader = ({ isLoading }) => {
    if (!isLoading) return null;
    return (
        <div
            id="loader"
            className="d-flex justify-content-center align-items-center flex-column"
        >
            <img src={logo} alt="loader" className="mb-5 App-logo" />
            <p>Loading...</p>
        </div>
    );
};

export default Loader;
