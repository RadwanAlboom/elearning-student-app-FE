import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class CourseForm extends Form {
    state = {
        fileName: '... اختر الملف من هنا',
        file: '',
        data: { coursename: '', description: ''},
        errors: {},
    };

    schema = {
        coursename: Joi.string().required().label('اسم المساق'),
        description: Joi.string().required().label('الوصف'),
        file: Joi.string().required(),
    };

    doSubmit = async () => {
        // Call the server
        const img = new FormData();
        img.append('file', this.state.file);

        const newCourse = {
            coursename: this.state.data.coursename,
            description: this.state.data.description,
            imageId: this.props.imageId,
            img
        };

        this.props.submitted(newCourse);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('coursename', 'اسم المساق')}
                    {this.renderTextArea('description', 'الوصف')}
                    <div style={{ marginBottom: '10px' }}>صورة المساق</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {!this.props.clicked && this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default CourseForm;
