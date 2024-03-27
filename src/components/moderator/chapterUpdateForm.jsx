import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ChapterUpdateForm extends Form {
    state = {
        data: { id: this.props.id, name: '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('المعرف'),
        name: Joi.string().required().min(5).label('اسم الفصل'),
    };

    doSubmit = () => {
        const updatedChapter = {
            name: this.state.data.name,
        };
        this.props.submitted(updatedChapter);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', 'المعرف', 'text', '', true)}
                    {this.renderInput('name', 'اسم الفصل')}
                    {this.renderButton('تحديث الفصل', false)}
                </form>
            </div>
        );
    }
}

export default ChapterUpdateForm;
