import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonAddForm extends Form {
    state = {
        fileName: '...اختار المحاضرة من هنا',
        file: '',
        data: { name: '', file: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('عنوان المحاضرة'),
        file: Joi.string().required().label('ملف المحاضرة'),
    };

    doSubmit = () => {
        const newLesson = {
            name: this.state.data.name,
            file: this.state.file,
        };
        this.props.submitted(newLesson);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'عنوان المحاضرة')}
                    {this.renderFileBrowser(
                        'file',
                        `${this.state.fileName}`,
                        'file',
                        '.mp4, .wmv, .mov'
                    )}
                    {this.props.isButtonShow &&
                        this.renderButton('اضافة المحاضرة', false)}
                </form>
            </div>
        );
    }
}

export default LessonAddForm;
