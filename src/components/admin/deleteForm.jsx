import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class DeleteForm extends Form {
    state = {
        data: {
            id: this.props.id + '',
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
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
                        هل انت متاكد انك تريد حذف هذا المساق؟
                    </div>
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default DeleteForm;
