import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class PDFAddForm extends Form {
    state = {
        fileName: '... اختر الملف من هنا',
        file: '',
        data: { name: ''},
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('اسم الملف'),
        file: Joi.string().required(),
    };

    doSubmit = async () => {
        // Call the server
        const pdfFile = new FormData();
        pdfFile.append('file', this.state.file);

        const newFile = {
            name: this.state.data.name,
            pdfFile
        };
        this.props.submitted(newFile);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'اسم الملف')}
                    <div style={{ marginBottom: '10px' }}>الملف</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`, 'file', '.pdf')}
                    {!this.props.clicked && this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default PDFAddForm;
