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
        id: Joi.string().required().label('المعرف'),
        coursename: Joi.string().allow(null, '').min(5).label('اسم المساق'),
        description: Joi.string().allow(null, '').min(5).label('الوصف'),
        url: Joi.string().allow(null, '').min(5).label('رابط الصورة'),
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
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('coursename', 'اسم المساق الجديد')}
                    {this.renderTextArea('description', 'الوصف الجديد')}
                    {this.renderInput('url', 'رابط الصورة الجديد')}
                    {this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default UpdateForm;
