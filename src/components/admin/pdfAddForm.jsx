import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class PDFAddForm extends Form {
    state = {
        data: { name: '', url: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('File name'),
        url: Joi.string().required().label('File URL'),
    };

    doSubmit = async () => {
        // Call the server
        const newFile = {
            name: this.state.data.name,
            url: this.state.data.url,
        };
        this.props.submitted(newFile);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'File name')}
                    {this.renderInput('url', 'File URL')}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default PDFAddForm;
