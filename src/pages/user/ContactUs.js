import React, { useState } from 'react';
import MotionHoc from './MotionHoc';

import http from '../../services/httpService';
import ContactForm from '../../components/contactForm';

let backendURL = process.env.REACT_APP_API_URL;

const ContactUsComponent = () => {
    const [isSuccess, setIsSuccess] = useState('hidden');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmitted = async (contactData) => {
        setIsLoading(true);
        setIsSuccess('hidden');
        try {
            await http.post(`${backendURL}/api/email`, contactData);
            setIsSuccess(true);
        } catch (error) {
            setIsSuccess(false);
        }
        setIsLoading(false);
    };
    return (
        <div className="contact-us">
            <ContactForm
                submitted={handleSubmitted}
                isSuccess={isSuccess}
                isLoading={isLoading}
            />
        </div>
    );
};

const ContactUs = MotionHoc(ContactUsComponent);

export default ContactUs;
