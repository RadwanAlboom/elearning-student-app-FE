import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import TextArea from './textArea';
import FileBrowser from './fileBrowser';
import PasswordInput from './passwordInput';

class Form extends Component {
    state = {
        fileName: '...اختار الملف من هنا',
        file: '',
        data: {},
        errors: {},
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error && (Object.keys(this.state.errors).length === 0)) return null;

        const errors = {};
        if (error && error.details) {
            for (let item of error.details) errors[item.path[0]] = item.message;
        }
        return errors;
    };

    validateProperty = ({ name, value, files }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        if (name === 'file' && error === null && files.length !== 0) {
            const fileName = files[0].name;
            const file = files[0];
            this.setState({ fileName, file });
        } else if (name === 'file' && error !== null) {
            const fileName = '...اختار الملف من هنا';
            const file = '';
            this.setState({ fileName, file });
            return error ? error.details[0].message : null;
        } else if (name === 'file' && error === null) {
            const fileName = '...اختار الملف من هنا';
            const file = '';
            this.setState({ fileName, file });
        } else return error ? error.details[0].message : null;
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    handleChange = (e) => {
        const { currentTarget: input } = e;
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const data = { ...this.state.data };
        data[input.name] = input.value;

        this.setState({ data, errors });
    };

    handleArabicNameChange = (e) => {
        const { name, value } = e.target;
        const errors = this.state.errors;

        // Arabic letters regex pattern
        const arabicRegex = /^[\u0621-\u064A\u0660-\u0669\s]+$/;

        // Split the name by spaces
        const nameParts = value.trim().split(/\s+/);
    
        // Validate the input value
        if (!arabicRegex.test(value)) {
          errors[name] = '.الرجاء إدخال الاسم بالأحرف العربية فقط';
        } else if (nameParts.length !== 4) {
          errors[name] = `.الرجاء إدخال الاسم الرباعي`;
        } else {
            delete errors[name];
        }
    
        // Update state with the new value and errors
        this.setState({
          data: {
            ...this.state.data,
            [name]: value,
          },
          errors,
        });
    };

    handleChangeDropDown = (event) => {
        const { target: input } = event;
        const { name, value } = input;
        const errors = { ...this.state.errors };
        if (name && value) {
            this.setState({ [name]: value });
            delete errors[name];
            this.setState({ errors });
        } else {
            this.setState({ [name]: value });
            errors[name] = "لا ينبغي أن يكون تخصصك فارغا";
            this.setState({ errors });
        }
    };

    checkDisabledButton = (flag) => {
        return flag
            ? (this.state.data.coursename === '' &&
                  this.state.data.description === '' &&
                  this.state.file === '') ||
                  this.validate()
            : this.validate();
    };

    renderButton(label, flag = true) {
        return (
            <div style={{ marginTop: '25px' }}>
                <button
                    disabled={this.checkDisabledButton(flag)}
                    className="btn btn-primary"
                >
                    {label}
                </button>
            </div>
        );
    }

    renderInput(name, label, type = 'text', icon, disabled = false) {
        const { data, errors } = this.state;

        return (
            <Input
                icon={icon}
                disabled={disabled}
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }
    renderPasswordInput(name) {
        const { data, errors } = this.state;

        return (
            <PasswordInput
                name={name}
                value={data[name]}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderTextArea(name, label) {
        const { data, errors } = this.state;
        return (
            <TextArea
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderFileBrowser(name, label, type = 'file', accept = '.jpg') {
        const { data, errors } = this.state;
        return (
            <FileBrowser
                accept={accept}
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderArabicNameInput(name, label, type = 'text', icon, disabled = false) {
        const { data, errors } = this.state;

        return (
            <Input
                icon={icon}
                disabled={disabled}
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleArabicNameChange}
                error={errors[name]}
            />
        );
    }
}

export default Form;
