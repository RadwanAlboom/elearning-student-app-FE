import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonAddForm extends Form {
    state = {
        data: { name: '', link: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('Chapter name'),
        link: Joi.string().required().label('Embeded-link'),
    };

    doSubmit = () => {
        const newLesson = {
            name: this.state.data.name,
            link: this.state.data.link,
        };
        this.props.submitted(newLesson);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'Lesson name')}
                    {this.renderInput('link', 'Embeded-link')}
                    {this.renderButton('Add Lesson', false)}
                </form>
            </div>
        );
    }
}

export default LessonAddForm;
