import React from 'react';
import Joi from 'joi-browser';
import Form from './form';

class ImgUpdateForm extends Form {
    state = {
        fileName: '... اختر الملف من هنا',
        file: '',
        data: { id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        file: Joi.string().required(),
    };

    doSubmit = async () => {
        // Call the server
        const newImg = new FormData();
        newImg.append('file', this.state.file);

        const image = {
            imageId: this.props.imageId,
            newImg
        }
        this.props.submitted(image);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    <div style={{ marginBottom: '10px' }}>صورة الملف الشخصي</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {!this.props.clicked && this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default ImgUpdateForm;
