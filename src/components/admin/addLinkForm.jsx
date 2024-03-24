import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class AddLinkForm extends Form {
    state = {
        data: { subject: '', link: '' },
        errors: {},
    };

    schema = {
        subject: Joi.string().required().label('Subject'),
        link: Joi.string().required().label('Embeded-link'),
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
                    {this.renderInput('subject', 'Subject')}
                    {this.renderInput('link', 'Embeded-link')}
                    {this.renderButton('Add Link', false)}
                </form>
            </div>
        );
    }
}

export default AddLinkForm;
