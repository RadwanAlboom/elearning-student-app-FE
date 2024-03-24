import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class CourseForm extends Form {
    state = {
        fileName: 'Choose File...',
        file: '',
        data: { coursename: '', description: '', file: '' },
        errors: {},
    };

    schema = {
        coursename: Joi.string().required().label('Course name'),
        description: Joi.string().required().label('Description'),
        file: Joi.string().required(),
    };

    doSubmit = async () => {
        // Call the server
        const newCourse = new FormData();
        newCourse.append('coursename', this.state.data.coursename);
        newCourse.append('description', this.state.data.description);
        newCourse.append('file', this.state.file);
        this.props.submitted(newCourse);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('coursename', 'Course name')}
                    {this.renderTextArea('description', 'Description')}
                    <div style={{ marginBottom: '10px' }}>Course image</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default CourseForm;
