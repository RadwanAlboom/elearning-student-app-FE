import React from 'react';
import Joi from 'joi-browser';

import Form from './form';
import './contactForm.css';
import whatsapp from '../assets/admin/whatsapp-purple.svg';

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
                        <h2 style={{marginBottom: '50px'}}>المبدع للتعليم الإلكتروني</h2>
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
                        <h3 style={{ marginBottom: '50px' }}>ارسل لنا عبر البريد الإلكتروني</h3>
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline'}}>
                            <a href="https://wa.me/970592078053" target='_blank'>
                                    <img alt="" src={whatsapp} height="50" />
                            </a>
                            <h5 style={{ marginBottom: '50px', marginLeft: '10px' }}>او تواصل معنا عبر الواتساب</h5>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            {this.renderInput('name', 'الاسم')}
                            {this.renderInput('city', 'المدينة')}
                            {this.renderInput('email', 'البريد الالكتروني')}
                            {this.renderInput('phone', 'رقم الهاتف')}
                            {this.renderTextArea('message', 'الرسالة')}

                            {!this.props.isLoading &&
                                this.renderButton(`ارسل`, true)}

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
                                    تم ارسال الرسالة بنجاح
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    فشل في ارسال الرسالة
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
