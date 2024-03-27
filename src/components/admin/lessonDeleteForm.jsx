import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonDeleteForm extends Form {
    state = {
        data: { id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('معرف المحاضرة'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'معرف المحاضرة', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                    هل انت متاكد انك تريد حذف المحاضرة ؟
                    </div>
                    {this.renderButton('حذف المحاضرة', false)}
                </form>
            </div>
        );
    }
}

export default LessonDeleteForm;
