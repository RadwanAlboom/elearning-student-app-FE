import React from 'react';
import Joi from 'joi-browser';
import Form from './form';

class ImgUpdateForm extends Form {
    state = {
        fileName: 'Choose File...',
        file: '',
        data: { file: '', id: this.props.id + '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('ID'),
        file: Joi.string().required(),
    };

    doSubmit = async () => {
        // Call the server
        const newImg = new FormData();
        newImg.append('file', this.state.file);
        this.props.submitted(newImg);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'ID', 'text', '', true)}
                    <div style={{ marginBottom: '10px' }}>Profile Image</div>
                    {this.renderFileBrowser('file', `${this.state.fileName}`)}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default ImgUpdateForm;
