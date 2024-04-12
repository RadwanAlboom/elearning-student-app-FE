import React from 'react';
import Joi from 'joi-browser';
import Form from './form';

class WhatsUpdateForm extends Form {
    state = {
        fileName: 'Choose File...',
        file: '',
        data: { link: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        link: Joi.string().required().min(5).max(255).label('رابط الواتساب'),
    };

    doSubmit = async () => {
        // Call the server
        const updatedWhats = {
            link: this.state.data.link,
        };
        this.props.submitted(updatedWhats);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('link', 'رابط الواتساب')}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default WhatsUpdateForm;
