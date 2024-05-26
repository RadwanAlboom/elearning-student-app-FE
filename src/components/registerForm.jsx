import React from "react";
import io from "socket.io-client";
import Joi from "joi-browser";
import Lottie from "react-lottie";
import { GoSignIn } from "react-icons/go";
import { AiFillLock } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import * as userService from "../services/userService";
import ErrorMessage from "./errorMessage";
import DropDown from "./dropDown";
import Form from "./form";
import loader from "../assets/admin/loader.json";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

let backendURL = process.env.REACT_APP_API_URL;

class RegisterForm extends Form {
    state = {
        data: {
            registerName: "",
            registerEmail: "",
            registerPassword: "",
            registerPhone: "",
        },
        errors: {},
        registerErrors: {},
        teacherChecked: false,
        major: 0,
        email: "",
        showloginButton: true,
        showlogoutButton: false,
        currentSocket: null,
        registerBtnClicked: false,
    };

    componentDidMount() {
        const socket = io(backendURL);
        this.setState({ currentSocket: socket });
    }

    componentWillUnmount() {
        this.state.currentSocket.disconnect();
    }

    schema = {
        registerName: Joi.string().required().min(5).max(255).label("اسم المستخدم"),
        registerEmail: Joi.string()
            .required()
            .min(5)
            .max(255)
            .email()
            .regex(/@gmail\.com$/)
            .label("البريد الإلكتروني"),
        registerPassword: Joi.string()
            .required()
            .min(5)
            .max(255)
            .label("كلمة المرور"),
        registerPhone: Joi.string()
            .required()
            .regex(/^[0-9]+$/)
            .min(10)
            .max(15)
            .label("رقم الهاتف"),
    };

    handleCheckChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    doSubmit = async () => {
        this.setState({
            registerBtnClicked: true,
            registerErrors: {},
            errors: {},
        });
        try {
            if (this.state.teacherChecked && !this.state.major) {
                this.setState({ registerBtnClicked: false });
                const registerErrors = { ...this.state.registerErrors };
                registerErrors.error = "لا ينبغي أن يكون تخصصك فارغا";
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
                type: "request",
            };
            this.state.currentSocket.emit("insertRequestNotification", {
                payload,
            });

            localStorage.setItem("isSuccessRegister", "true");
            window.location = "/";
            const registerErrors = {};
            this.setState({ registerErrors });
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const registerErrors = { ...this.state.registerErrors };
                registerErrors.error = ex.response.data;
                this.setState({ registerErrors });
            }
            this.setState({ registerBtnClicked: false });
        }
    };

    render() {
        const lock = <AiFillLock style={{ marginRight: "5px" }} />;
        const email = <MdEmail style={{ marginRight: "5px" }} />;
        const user = <FaUserTie style={{ marginRight: "5px" }} />;
        const phone = <FaPhone style={{ marginRight: "5px" }} />;
        return (
            <div className="form-section">
                <form onSubmit={this.handleSubmit}>
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            borderBottom: "1px solid #bfbfbf",
                            paddingBottom: "20px",
                        }}
                    >
                        <GoSignIn style={{ marginRight: "10px" }} />
                        انشاء حساب جديد
                    </h2>
                    <ErrorMessage error={this.state.registerErrors.error} />
                    {this.renderInput(
                        "registerName",
                        "Username",
                        "username",
                        user
                    )}
                    {this.renderInput("registerPhone", "Phone", "phone", phone)}
                    {this.renderInput("registerEmail", "Email", "email", email)}

                    <div>{lock} Password</div>
                    {this.renderPasswordInput("registerPassword")}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedB}
                                onChange={this.handleCheckChange}
                                name="teacherChecked"
                                color="primary"
                            />
                        }
                        label="انشاء حساب كمعلم"
                    />
                    {this.state.teacherChecked && (
                        <DropDown
                            handleChange={this.handleChangeDropDown}
                            val={this.state.major}
                            error={this.state.errors.major}
                            majors={this.props.majors}
                        />
                    )}

                    {!this.state.registerBtnClicked &&
                        this.renderButton("ارسل طلب انضمام", false)}
                    {this.state.registerBtnClicked && (
                        <Lottie
                            options={defaultOptions}
                            height={100}
                            width={100}
                        />
                    )}
                </form>
            </div>
        );
    }
}

export default RegisterForm;
