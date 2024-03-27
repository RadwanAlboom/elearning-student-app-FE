import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonAddForm extends Form {
    state = {
        data: { name: '', link: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('عنوان المحاضرة'),
        link: Joi.string().required().label('رابط المحاضرة'),
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
                    {this.renderInput('name', 'عنوان المحاضرة')}
                    {this.renderInput('link', 'رابط المحاضرة')}
                    <div style={{textAlign: 'right'}}>
                        {this.renderButton('اضافة محاضرة', false)}
                    </div>
                </form>
            </div>
        );
    }
}

export default LessonAddForm;
