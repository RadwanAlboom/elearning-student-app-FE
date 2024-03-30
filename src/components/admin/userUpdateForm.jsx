import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class UserUpdateForm extends Form {
    state = {
        data: { name: '', email: '', password: '', clearFingerprint: false, id: this.props.id + '' },
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
        clearFingerprint: Joi.boolean().default(false)
    };

    doSubmit = async () => {
        // Call the server
        const updatedStudent = {
            name: this.state.data.name,
            email: this.state.data.email,
            password: this.state.data.password,
            clearFingerprint: this.state.data.clearFingerprint
        };
        this.props.submitted(updatedStudent);
    };

    handleCheckChange = (event) => {
        this.state.data.clearFingerprint = event.target.checked ? true : false;
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={this.handleCheckChange}
                                name="teacherChecked"
                                color="primary"
                            />
                        }
                        label="حذف البصمات"
                    />
                    {this.renderButton(`تحديث المعلومات`, false)}
                </form>
            </div>
        );
    }
}

export default UserUpdateForm;
