import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class DeleteLinkForm extends Form {
    state = {
        data: { id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('Link id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Link id', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this Link?
                    </div>
                    {this.renderButton('Delete Link', false)}
                </form>
            </div>
        );
    }
}

export default DeleteLinkForm;
