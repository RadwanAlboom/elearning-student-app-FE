import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class updateLinkForm extends Form {
    state = {
        data: { subject: '', link: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('Link id'),
        subject: Joi.string().allow(null, '').min(5).label('Subject'),
        link: Joi.string().allow(null, '').min(5).label('Embeded-link'),
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
                    {this.renderInput('id', 'Link id', 'text', '', true)}
                    {this.renderInput('subject', 'Subject')}
                    {this.renderInput('link', 'Embeded-link')}
                    {this.renderButton('Update Link', false)}
                </form>
            </div>
        );
    }
}

export default updateLinkForm;
