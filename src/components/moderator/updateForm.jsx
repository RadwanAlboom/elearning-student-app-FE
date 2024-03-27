import React from 'react';
import Joi from 'joi-browser';

import Form from '../form';

class UpdateForm extends Form {
    state = {
        fileName: 'Choose File...',
        file: '',
        data: {
            coursename: '',
            description: '',
            file: '',
            id: this.props.id + '',
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        coursename: Joi.string().allow(null, '').min(5).label('اسم المساق'),
        description: Joi.string().allow(null, '').min(5).label('الوصف'),
        file: Joi.string().allow(null, ''),
    };

    doSubmit = () => {
        // Call the server
        const updateCourse = new FormData();
        updateCourse.append('coursename', this.state.data.coursename);
        updateCourse.append('description', this.state.data.description);
        updateCourse.append('file', this.state.file);
        this.props.submitted(updateCourse);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('coursename', 'اسم المساق الجديد')}
                    {this.renderTextArea('description', 'الوصف الجديد')}
                    <div style={{ marginBottom: '10px' }}>صورة المساق الجديدة</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default UpdateForm;
