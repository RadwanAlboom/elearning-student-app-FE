import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ExamDeleteForm extends Form {
    state = {
        data: { id: this.props.id },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('معرف الامتحان'),
    };

    doSubmit = () => {
        this.props.submitted();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'معرف الامتحان', 'number', '', true)}
                    <div style={{ fontSize: '1.5rem' }}>
                        هل انت متاكد انك تريد حذف هذا الامتحان؟
                    </div>
                    {this.renderButton('حذف امتحان', false)}
                </form>
            </div>
        );
    }
}

export default ExamDeleteForm;
