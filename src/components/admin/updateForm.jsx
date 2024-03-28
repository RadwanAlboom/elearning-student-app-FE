import React from 'react';
import Joi from 'joi-browser';

import Form from '../form';

class UpdateForm extends Form {
    state = {
        fileName: '... اختر الملف من هنا',
        file: '',
        data: {
            coursename: '',
            description: '',
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
        let img = null;

        if ( this.state.file !== null &&  this.state.file !== '') {
            img = new FormData();
            img.append('file', this.state.file);
        }

        const updateCourse = {
            coursename: this.state.data.coursename,
            description: this.state.data.description,
            img
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
                    <div style={{ marginBottom: '10px' }}>صورة المساق الجديدة</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {!this.props.clicked && this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default UpdateForm;
