import React from 'react';
import Joi from 'joi-browser';

import Form from '../form';

class PDFUpdateForm extends Form {
    state = {
        data: {
            name: '',
            url: '',
            id: this.props.id + '',
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('File id'),
        name: Joi.string().allow(null, '').min(5).label('File name'),
        url: Joi.string().allow(null, '').min(5).label('File URL'),
    };

    doSubmit = () => {
        // Call the server
        const updateFile = {
            name: this.state.data.name,
            url: this.state.data.url,
        };
        this.props.submitted(updateFile);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'File id', 'text', '', true)}
                    {this.renderInput('name', 'New File name')}
                    {this.renderInput('url', 'New File URL')}
                    {this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default PDFUpdateForm;
