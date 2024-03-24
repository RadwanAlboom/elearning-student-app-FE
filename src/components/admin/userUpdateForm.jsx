import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class UserUpdateForm extends Form {
    state = {
        data: { name: '', email: '', password: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('ID'),
        name: Joi.string().allow(null, '').min(5).max(255).label('Name'),
        email: Joi.string().allow(null, '').email().label('Email'),
        password: Joi.string()
            .allow(null, '')
            .min(5)
            .max(255)
            .label('Password'),
    };

    doSubmit = async () => {
        // Call the server
        const updatedStudent = {
            name: this.state.data.name,
            email: this.state.data.email,
            password: this.state.data.password,
        };
        this.props.submitted(updatedStudent);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'ID', 'text', '', true)}
                    {this.renderInput('name', 'New Name')}
                    {this.renderInput('email', 'Email', 'email')}
                    <div>Update Password</div>
                    {this.renderPasswordInput('password')}
                    {this.renderButton(`Update Info`, false)}
                </form>
            </div>
        );
    }
}

export default UserUpdateForm;
