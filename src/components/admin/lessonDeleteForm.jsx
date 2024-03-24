import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonDeleteForm extends Form {
    state = {
        data: { id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('Lesson id'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Lesson id', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        Are you sure you want to delete this Lesson?
                    </div>
                    {this.renderButton('Delete Lesson', false)}
                </form>
            </div>
        );
    }
}

export default LessonDeleteForm;
