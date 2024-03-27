import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class updateLinkForm extends Form {
    state = {
        data: { subject: '', link: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('المعرف'),
        subject: Joi.string().allow(null, '').min(5).label('الموضوع'),
        link: Joi.string().allow(null, '').min(5).label('الرابط'),
    };

    doSubmit = () => {
        const updatedLink = {
            subject: this.state.data.subject,
            link: this.state.data.link,
        };
        this.props.submitted(updatedLink);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('subject', 'الموضوع')}
                    {this.renderInput('link', 'الرابط')}
                    {this.renderButton('تحديث الرابط', false)}
                </form>
            </div>
        );
    }
}

export default updateLinkForm;
