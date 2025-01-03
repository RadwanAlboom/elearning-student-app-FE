import React from 'react';
import Joi from 'joi-browser';
import Form from '../form';

class LessonUpdateForm extends Form {
    state = {
        data: { name: '', link: '', id: this.props.id + '', type: '' },
        errors: {},
    };

    schema = {
        id: Joi.number().integer().required().label('معرف المحاضرة'),
        name: Joi.string().allow(null, '').min(5).label('اسم المحاضرة الجديد'),
        link: Joi.string().allow(null, '').min(5).label('رابط المحاضرة الجديد'),
        type: Joi.string().valid('drive', 'vimeo').label('اختار المنصة'),
    };

    // Handle type change
    handleTypeChange = (event) => {
        const data = { ...this.state.data };
        data.type = event.target.value;
        this.setState({ data });
    }; 

    doSubmit = () => {
        const updatedLesson = {
            name: this.state.data.name,
            link: this.state.data.link,
            type: this.state.data.type,
        };
        this.props.submitted(updatedLesson);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput('id', '', 'text', 'معرف المحاضرة', true)}
                    {this.renderInput('name', 'اسم المحاضرة الجديد')}
                    {this.renderInput('link', 'رابط المحاضرة الجديد')}

                    <div className="form-group">
                        <label htmlFor="platform">اختار المنصة</label>
                        <select
                            id="platform"
                            value={this.state.data.type}
                            onChange={this.handleTypeChange}
                            className="form-control"
                        >
                            <option value="" style={{textAlign: 'right'}}>--اختار المنصة--</option>
                            <option value="drive" style={{textAlign: 'right'}}>Drive -</option>
                            <option value="vimeo" style={{textAlign: 'right'}}>Vimeo -</option>
                        </select>
                    </div>

                    {this.renderButton('تحديث المحاضرة', false)}
                </form>
            </div>
        );
    }
}

export default LessonUpdateForm;
