import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ChapterAddForm extends Form {
    state = {
        data: { name: '' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('اسم الفصل'),
    };

    doSubmit = () => {
        const newChapter = {
            name: this.state.data.name,
        };
        this.props.submitted(newChapter);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'اسم الفصل')}
                    {this.renderButton('اضافة فصل', false)}
                </form>
            </div>
        );
    }
}

export default ChapterAddForm;
