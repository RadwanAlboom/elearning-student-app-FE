import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class UserUpdateForm extends Form {
    state = {
        data: { name: '', email: '', password: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        name: Joi.string().allow(null, '').min(5).max(255).label('الاسم'),
        email: Joi.string().allow(null, '').email().label('الايميل'),
        password: Joi.string()
            .allow(null, '')
            .min(5)
            .max(255)
            .label('كلمة المرور'),
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
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('name', 'الاسم الجديد')}
                    {this.renderInput('email', 'الايميل', 'email')}
                    <div>تحديث كلمة المرور</div>
                    {this.renderPasswordInput('password')}
                    {this.renderButton(`تحديث المعلومات`, false)}
                </form>
            </div>
        );
    }
}

export default UserUpdateForm;
