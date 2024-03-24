import React from 'react';
import Joi from 'joi-browser';

import Form from '../form';

class UpdateForm extends Form {
    state = {
        data: {
            coursename: '',
            description: '',
            url: '',
            id: this.props.id + '',
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('Course id'),
        coursename: Joi.string().allow(null, '').min(5).label('Course name'),
        description: Joi.string().allow(null, '').min(5).label('Description'),
        url: Joi.string().allow(null, '').min(5).label('Image URL'),
    };

    doSubmit = () => {
        // Call the server
        const updateCourse = {
            coursename: this.state.data.coursename,
            description: this.state.data.description,
            url: this.state.data.url,
        };
        this.props.submitted(updateCourse);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'Course id', 'text', '', true)}
                    {this.renderInput('coursename', 'New course name')}
                    {this.renderTextArea('description', 'New description')}
                    {this.renderInput('url', 'New Image URL')}
                    {this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default UpdateForm;
