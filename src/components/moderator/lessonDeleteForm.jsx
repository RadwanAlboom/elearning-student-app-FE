import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonDeleteForm extends Form {
    state = {
        data: { id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('Lesson id'),
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
                        هل انت متاكد انك تريد حذف المحاضرة ؟
                    </div>
                    {this.renderButton('Delete Lesson', false)}
                </form>
            </div>
        );
    }
}

export default LessonDeleteForm;
