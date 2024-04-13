import React from "react";
import Lottie from 'react-lottie';
import io from 'socket.io-client';
import Joi from "joi-browser";
import Form from "../form";
import auth from "../../services/authService";
import ErrorMessage from "../../components/errorMessage";
import loader from '../../assets/admin/loader.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

let backendURL = process.env.REACT_APP_API_URL;
class VerificationForm extends Form {
    state = {
        data: { code: "" },
        errors: {},
        verifyError: "",
        verifyClicked: false,
        currentSocket: null
    };

    componentDidMount() {
        const socket = io(backendURL);
        this.setState({ currentSocket: socket });
    }

    componentWillUnmount() {
        this.state.currentSocket.disconnect();
    }

    schema = {
        code: Joi.string().min(10).max(255).required().label("رمز التحقق"),
    };

    doSubmit = async () => {
        this.setState({ verifyClicked: true, verifyError: "" });
        const { from, email, password, isModerator, major } =
            this.props.location.state;
        try {
            await auth.verify(
                this.state.data.code.trim(),
                email,
                password,
                isModerator,
                major
            );

             //login success => dispatch a notification
             const payload = {
                id: auth.getCurrentUser().id,
                name: auth.getCurrentUser().name,
                role: isModerator ? 'moderator' : 'user',
                type: 'login',
            };
            this.state.currentSocket.emit('loginNotifications', { payload });

            window.location = from;
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                this.setState({ verifyError: ex.response.data });
            }
            this.setState({ verifyClicked: false});
        }
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <ErrorMessage error={this.state.verifyError} />
                    {this.renderInput("code", ":ادخل رمز التحقق")}
                    <div className="verification-btn">
                        {!this.state.verifyClicked && this.renderButton("ارسل رمز التحقق", true)}
                        {this.state.verifyClicked && <Lottie options={defaultOptions} height={100} width={100} />}
                    </div>
                </form>
            </div>
        );
    }
}

export default VerificationForm;
