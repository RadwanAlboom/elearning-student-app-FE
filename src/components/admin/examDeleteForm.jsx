import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ExamDeleteForm extends Form {
    state = {
        data: { id: this.props.id },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('Exam id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Exam id', 'number', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this Exam?
                    </div>
                    {this.renderButton('Delete Exam', false)}
                </form>
            </div>
        );
    }
}

export default ExamDeleteForm;
