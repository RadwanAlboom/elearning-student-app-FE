import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonUpdateForm extends Form {
    state = {
        data: { name: '', link: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        name: Joi.string().allow(null, '').min(5).label('اسم المحاضرة'),
        link: Joi.string().allow(null, '').min(5).label('رابط المحاضرة'),
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
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('name', 'اسم المحاضرة')}
                    {this.renderInput('link', 'رابط المحاضرة')}
                    {this.renderButton('تحديث المحاضرة', false)}
                </form>
            </div>
        );
    }
}

export default LessonUpdateForm;
