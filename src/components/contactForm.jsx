import React from 'react';
import Joi from 'joi-browser';

import Form from './form';
import './contactForm.css';

class ContactForm extends Form {
    state = {
        data: { name: '', city: '', email: '', phone: '', message: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().min(5).max(100).label('Name'),
        city: Joi.string().required().min(3).max(100).label('City'),
        email: Joi.string().required().email().label('Email'),
        phone: Joi.string().required().min(10).max(100).label('Phone'),
        message: Joi.string().required().min(10).max(200).label('Message'),
    };

    doSubmit = () => {
        this.props.submitted(this.state.data);
    };
    render() {
        return (
            <div className="container-contact">
                <div className="wrapper animated bounceInLeft">
                    <div className="company-info">
                        <h2>Done With It</h2>
                        <ul>
                            <li>
                                <i className="fa fa-road"></i> Al-Mammon Street,
                                Nablus, Palestine
                            </li>
                            <li>
                                <i className="fa fa-phone"></i> (+972) 595254935
                            </li>
                            <li>
                                <i className="fa fa-envelope"></i>{' '}
                                radwanalboom@gmail.com
                            </li>
                        </ul>
                    </div>
                    <div className="contact">
                        <h3 style={{ marginBottom: '50px' }}>Email Us</h3>
                        <form onSubmit={this.handleSubmit}>
                            {this.renderInput('name', 'Name')}
                            {this.renderInput('city', 'City')}
                            {this.renderInput('email', 'Email Address')}
                            {this.renderInput('phone', 'Phone Number')}
                            {this.renderTextArea('message', 'Message')}

                            {!this.props.isLoading &&
                                this.renderButton(`Submit`, true)}

                            {this.props.isSuccess === 'hidden' ? (
                                ''
                            ) : this.props.isSuccess ? (
                                <div
                                    className="alert alert-danger"
                                    style={{
                                        backgroundColor: '#bcffb6',
                                        borderColor: '#bcffb6',
                                    }}
                                >
                                    Message sent successfully
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    Message send failed
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactForm;
