import React from 'react';
import io from 'socket.io-client';
import Joi from 'joi-browser';
import { GoSignIn } from 'react-icons/go';
import { AiFillLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import ErrorMessage from './errorMessage';
import DropDown from './dropDown';
import auth from '../services/authService';
import Form from './form';
import { addNotification } from '../store/userNotifications';

let backendURL = process.env.REACT_APP_API_URL;

class LoginForm extends Form {
    state = {
        data: { loginEmail: '', password: '' },
        errors: {},
        loginErrors: {},
        teacherChecked: false,
        major: 0,
        currentSocket: null,
        loginBtnClicked : false
    };

    componentDidMount() {
        const socket = io(backendURL);
        this.setState({ currentSocket: socket });
    }

    componentWillUnmount() {
        this.state.currentSocket.disconnect();
    }

    schema = {
        loginEmail: Joi.string().required().email().label('Email'),
        password: Joi.string().required().min(5).max(255).label('Password'),
    };

    handleCheckChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    doSubmit = async () => {
        this.setState({loginBtnClicked: true})
        try {
            if (this.state.teacherChecked && !this.state.major) {
                const loginErrors = { ...this.state.loginErrors };
                loginErrors.error = 'Your major should not be empty';
                this.setState({ loginErrors });
                return;
            }
            const { data, teacherChecked, major } = this.state;
            const {loginEmail, password} = data;
            await auth.login(
                loginEmail,
                password,
                teacherChecked,
                major
            );
            
            const { state } = this.props.location;
            let redirectUrl = state ? state.from.pathname : '/';

            const user = auth.getCurrentUser();
            if (user && user.isAdmin) {
                window.location = redirectUrl;
            } else {
                this.props.history.push("/verification", {
                    from: redirectUrl, 
                    email: loginEmail,
                    password,
                    isModerator: teacherChecked,
                    major
                });
                toast.success('تم ارسال رمز التحقق الى بريدك الالكتروني');
            }
            const loginErrors = {};
            this.setState({ loginErrors });
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const loginErrors = { ...this.state.loginErrors };
                loginErrors.error = ex.response.data;
                this.setState({ loginErrors });
            }
            this.setState({loginBtnClicked: false})
        }
    };

    render() {
        const lock = <AiFillLock style={{ marginRight: '5px' }} />;
        const email = <MdEmail style={{ marginRight: '5px' }} />;
        return (
            <div className="form-section">
                <form onSubmit={this.handleSubmit}>
                    <h2
                        className="form-title"
                        style={{
                            textAlign: 'center',
                            marginBottom: '50px',
                            borderBottom: '1px solid #bfbfbf',
                            paddingBottom: '20px',
                        }}
                    >
                        <GoSignIn style={{ marginRight: '10px' }} />
                        تسجيل الدخول
                    </h2>
                    <ErrorMessage error={this.state.loginErrors.error} />
                    {this.renderInput('loginEmail', 'Email', 'email', email)}
                    <div>{lock} Password</div>
                    {this.renderPasswordInput('password')}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.teacherChecked}
                                onChange={this.handleCheckChange}
                                name="teacherChecked"
                                color="primary"
                            />
                        }
                        label="تسجيل الدخول كمعلم"
                    />
                    {this.state.teacherChecked && (
                        <DropDown
                            handleChange={this.handleChangeDropDown}
                            val={this.state.major}
                            error={this.state.errors.major}
                            majors={this.props.majors}
                        />
                    )}
                    {!this.state.loginBtnClicked && this.renderButton('تسجيل الدخول', false)}
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userNotifications: state.userNotifications.list,
});

const mapDispatchToProps = (dispatch) => ({
    addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
