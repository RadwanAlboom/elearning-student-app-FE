import React from 'react';
import Lottie from 'react-lottie';
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
import loader from '../assets/admin/loader.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

class LoginForm extends Form {
    state = {
        data: { loginEmail: '', password: '' },
        errors: {},
        loginErrors: {},
        teacherChecked: false,
        major: 0,
        loginBtnClicked : false
    };

    schema = {
        loginEmail: Joi.string().required().email().label('البريد الإلكتروني'),
        password: Joi.string().required().min(5).max(255).label('كلمة المرور'),
    };

    handleCheckChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    doSubmit = async () => {
        this.setState({loginBtnClicked: true, loginErrors: {}, errors: {}})
        try {
            if (this.state.teacherChecked && !this.state.major) {
                this.setState({loginBtnClicked: false})
                const loginErrors = { ...this.state.loginErrors };
                loginErrors.error = 'لا ينبغي أن يكون تخصصك فارغا';
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
                    {this.renderInput('loginEmail', 'البريد الإلكتروني', 'email', email)}
                    <div>{lock} كلمة المرور</div>
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
                    {this.state.loginBtnClicked && <Lottie options={defaultOptions} height={100} width={100} />}
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
