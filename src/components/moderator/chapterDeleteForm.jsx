import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ChapterDeleteForm extends Form {
    state = {
        data: {
            id: this.props.id,
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('Chapter id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Chapter id', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this chapter?
                    </div>
                    {this.renderButton(`Delete Chapter`, false)}
                </form>
            </div>
        );
    }
}

export default ChapterDeleteForm;
