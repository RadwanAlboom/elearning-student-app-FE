import React from 'react';
import Joi from 'joi-browser';
import Form from './form';

class PassUpdateForm extends Form {
    state = {
        fileName: 'Choose File...',
        file: '',
        data: { password: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('ID'),
        password: Joi.string().required().min(5).max(255).label('Password'),
    };

    doSubmit = async () => {
        // Call the server
        const updatedPass = {
            password: this.state.data.password,
        };
        this.props.submitted(updatedPass);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'ID', 'text', '', true)}
                    <div>Update Password</div>
                    {this.renderPasswordInput('password')}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default PassUpdateForm;
