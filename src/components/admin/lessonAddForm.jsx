import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonAddForm extends Form {
    state = {
        data: { name: '', link: '', type: 'drive' },
        errors: {},
    };

    schema = {
        name: Joi.string().required().label('عنوان المحاضرة'),
        link: Joi.string().required().label('رابط المحاضرة'),
        type: Joi.string().valid('drive', 'vimeo').required().label('اختار المنصة'),
    };

    // Handle type change
    handleTypeChange = (event) => {
        const data = { ...this.state.data };
        data.type = event.target.value;
        this.setState({ data });
    };

    doSubmit = () => {
        const newLesson = {
            name: this.state.data.name,
            link: this.state.data.link,
            type: this.state.data.type,
        };
        this.props.submitted(newLesson);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('name', 'عنوان المحاضرة')}
                    {this.renderInput('link', 'رابط المحاضرة')}

                    <div className="form-group">
                        <label htmlFor="platform">اختار المنصة</label>
                        <select
                            id="platform"
                            value={this.state.data.type}
                            onChange={this.handleTypeChange}
                            className="form-control"
                        >
                            <option value="drive" style={{textAlign: 'right', padding: '20px'}}>Drive -</option>
                            <option value="vimeo" style={{textAlign: 'right'}}>Vimeo -</option>
                        </select>
                    </div>

                    <div style={{textAlign: 'right'}}>
                        {this.renderButton('اضافة محاضرة', false)}
                    </div>
                </form>
            </div>
        );
    }
}

export default LessonAddForm;
