import React from "react";
import Joi from "joi-browser";
import Form from "../form";
import auth from "../../services/authService";
import ErrorMessage from "../../components/errorMessage";

class VerificationForm extends Form {
    state = {
        data: { code: "" },
        errors: {},
        verifyError: "",
        verifyClicked: false
    };

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
                    </div>
                </form>
            </div>
        );
    }
}

export default VerificationForm;
