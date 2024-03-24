import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class CourseForm extends Form {
    state = {
        data: { coursename: '', description: '', url: '' },
        errors: {},
    };

    schema = {
        coursename: Joi.string().required().label('Course name'),
        description: Joi.string().required().label('Description'),
        url: Joi.string().required().label('Image URL'),
    };

    doSubmit = async () => {
        // Call the server
        const newCourse = {
            coursename: this.state.data.coursename,
            description: this.state.data.description,
            url: this.state.data.url,
        };

        this.props.submitted(newCourse);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('coursename', 'Course name')}
                    {this.renderTextArea('description', 'Description')}
                    {this.renderInput('url', 'Image URL')}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default CourseForm;
