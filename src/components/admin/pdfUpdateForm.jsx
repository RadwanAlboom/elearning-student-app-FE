import React from 'react';
import Joi from 'joi-browser';

import Form from '../form';

class PDFUpdateForm extends Form {
    state = {
        fileName: '... اختر الملف من هنا',
        file: '',
        data: {
            name: '',
            id: this.props.id + '',
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        name: Joi.string().allow(null, '').min(5).label('اسم الملف'),
        file: Joi.string().allow(null, ''),
    };

    doSubmit = () => {
        // Call the server
        let pdfFile = null;

        if ( this.state.file !== null &&  this.state.file !== '') {
            pdfFile = new FormData();
            pdfFile.append('file', this.state.file);
        }

        const updateFile = {
            name: this.state.data.name,
            linkId: this.props.linkId,
            pdfFile
        };
        this.props.submitted(updateFile);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('name', 'اسم الملف الجديد')}
                    <div style={{ marginBottom: '10px' }}>الملف الجديد</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`, 'file', '.pdf')}
                    {!this.props.clicked && this.renderButton(`${this.props.btnName}`)}
                </form>
            </div>
        );
    }
}

export default PDFUpdateForm;
