import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class PDFDeleteForm extends Form {
    state = {
        data: {
            id: this.props.id,
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
    };

    doSubmit = () => {
        this.props.submitted(this.props.linkId);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        هل انت متأكد انك تريد حذف هذا الملف؟
                    </div>
                    {this.renderButton(`PDF حذف ملف`, false)}
                </form>
            </div>
        );
    }
}

export default PDFDeleteForm;
