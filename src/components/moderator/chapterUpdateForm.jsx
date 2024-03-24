import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class ChapterUpdateForm extends Form {
    state = {
        data: { id: this.props.id, name: '' },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label('Chapter id'),
        name: Joi.string().required().min(5).label('Chapter name'),
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
                    {this.renderInput('id', 'Chapter id', 'text', '', true)}
                    {this.renderInput('name', 'Chapter name')}
                    {this.renderButton('Update Chapter', false)}
                </form>
            </div>
        );
    }
}

export default ChapterUpdateForm;
