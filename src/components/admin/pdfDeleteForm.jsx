import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class PDFDeleteForm extends Form {
    state = {
        data: {
            id: this.props.id,
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('File id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'File id', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this File?
                    </div>
                    {this.renderButton(`Delete PDF File`, false)}
                </form>
            </div>
        );
    }
}

export default PDFDeleteForm;
