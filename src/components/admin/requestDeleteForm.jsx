import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class RequestDeleteForm extends Form {
    state = {
        data: {
            id: this.props.id,
        },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('المعرف'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        هل انت متأكد من انك تريد حذف هذا الطلب؟
                    </div>
                    {this.renderButton(`حذف طلب`, false)}
                </form>
            </div>
        );
    }
}

export default RequestDeleteForm;
