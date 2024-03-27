import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class AddLinkForm extends Form {
    state = {
        data: { subject: '', link: '' },
        errors: {},
    };

    schema = {
        subject: Joi.string().required().label('الموضوع'),
        link: Joi.string().required().label('الرابط'),
    };

    doSubmit = () => {
        const newLink = {
            subject: this.state.data.subject,
            link: this.state.data.link,
        };
        this.props.submitted(newLink);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('subject', 'الموضوع')}
                    {this.renderInput('link', 'الرابط')}
                    {this.renderButton('اضافة الرابط', false)}
                </form>
            </div>
        );
    }
}

export default AddLinkForm;
