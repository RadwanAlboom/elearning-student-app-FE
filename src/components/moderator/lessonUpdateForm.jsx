import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonUpdateForm extends Form {
    state = {
        data: { name: '', link: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('Lesson id'),
        name: Joi.string().allow(null, '').min(5).label('Lesson name'),
        link: Joi.string().allow(null, '').min(5).label('Embeded-link'),
    };

    doSubmit = () => {
        const updatedLesson = {
            name: this.state.data.name,
            link: this.state.data.link,
        };
        this.props.submitted(updatedLesson);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Lesson id', 'text', '', true)}
                    {this.renderInput('name', 'Lesson name')}
                    {this.renderInput('link', 'Embeded-link')}
                    {this.renderButton('Update Lesson', false)}
                </form>
            </div>
        );
    }
}

export default LessonUpdateForm;
