import React from 'react';
import io from 'socket.io-client';
import Joi from 'joi-browser';
import { GoSignIn } from 'react-icons/go';
import { AiFillLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import * as userService from '../services/userService';
import ErrorMessage from './errorMessage';
import DropDown from './dropDown';
import Form from './form';

let backendURL = process.env.REACT_APP_API_URL;

class RegisterForm extends Form {
    state = {
        data: {
            registerName: '',
            registerEmail: '',
            registerPassword: '',
        },
        errors: {},
        registerErrors: {},
        teacherChecked: false,
        major: 0,
        email: '',
        showloginButton: true,
        showlogoutButton: false,
        currentSocket: null,
    };

    componentDidMount() {
        const socket = io(backendURL);
        this.setState({ currentSocket: socket });
    }

    componentWillUnmount() {
        this.state.currentSocket.disconnect();
    }

    schema = {
        registerName: Joi.string().required().min(5).max(255).label('Username'),
        registerEmail: Joi.string()
            .required()
            .min(5)
            .max(255)
            .email()
            .label('Email'),
        registerPassword: Joi.string()
            .required()
            .min(5)
            .max(255)
            .label('Password'),
    };

    handleCheckChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    doSubmit = async () => {
        try {
            if (this.state.teacherChecked && !this.state.major) {
                const registerErrors = { ...this.state.registerErrors };
                registerErrors.error = 'Your major should not be empty';
                this.setState({ registerErrors });
                return;
            }
            await userService.register(
                this.state.data,
                this.state.major,
                this.state.teacherChecked
            );

            //request success => dispatch a notification
            const payload = {
                name: this.state.data.registerName,
                email: this.state.data.registerEmail,
                type: 'request',
            };
            this.state.currentSocket.emit('insertRequestNotification', {
                payload,
            });

            window.location = '/';
            const registerErrors = {};
            this.setState({ registerErrors });
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const registerErrors = { ...this.state.registerErrors };
                registerErrors.error = ex.response.data;
                this.setState({ registerErrors });
            }
        }
    };

    render() {
        const lock = <AiFillLock style={{ marginRight: '5px' }} />;
        const email = <MdEmail style={{ marginRight: '5px' }} />;
        return (
            <div className="form-section">
                <form onSubmit={this.handleSubmit}>
                    <h2
                        style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            borderBottom: '1px solid #bfbfbf',
                            paddingBottom: '20px',
                        }}
                    >
                        <GoSignIn style={{ marginRight: '10px' }} />
                        Create Account
                    </h2>
                    <ErrorMessage error={this.state.registerErrors.error} />
                    {this.renderInput(
                        'registerName',
                        'Username',
                        'username',
                        email
                    )}
                    {this.renderInput('registerEmail', 'Email', 'email', email)}

                    <div>{lock} Password</div>
                    {this.renderPasswordInput('registerPassword')}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedB}
                                onChange={this.handleCheckChange}
                                name="teacherChecked"
                                color="primary"
                            />
                        }
                        label="Register as a teacher"
                    />
                    {this.state.teacherChecked && (
                        <DropDown
                            handleChange={this.handleChangeDropDown}
                            val={this.state.major}
                            error={this.state.errors.major}
                            majors={this.props.majors}
                        />
                    )}

                    {this.renderButton('Request a registration', false)}
                </form>
            </div>
        );
    }
}

export default RegisterForm;
