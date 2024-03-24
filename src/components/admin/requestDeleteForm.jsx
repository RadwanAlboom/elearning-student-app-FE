import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class RequestDeleteForm extends Form {
    state = {
        data: {
            id: this.props.id,
        },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('Request id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Request id', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this request?
                    </div>
                    {this.renderButton(`Delete Request`, false)}
                </form>
            </div>
        );
    }
}

export default RequestDeleteForm;
