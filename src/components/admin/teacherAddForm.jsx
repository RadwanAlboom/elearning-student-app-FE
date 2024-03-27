import React from 'react';
import Joi from 'joi-browser';
import { GoSignIn } from 'react-icons/go';
import { AiFillLock } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import ErrorMessage from '../errorMessage';
import DropDown from '../dropDown';
import Form from '../form';

import { addTeacher } from '../../store/teachers';

class TeacherAddForm extends Form {
    state = {
        data: {
            registerName: '',
            registerEmail: '',
            registerPassword: '',
        },
        errors: {},
        registerErrors: {},
        major: '',
    };

    schema = {
        registerName: Joi.string().required().min(6).max(255).label('اسم المستخدم'),
        registerEmail: Joi.string().required().email().label('الايميل'),
        registerPassword: Joi.string()
            .required()
            .min(5)
            .max(255)
            .label('كلمة المرور'),
    };

    doSubmit = async () => {
        try {
            if (!this.state.major) {
                const registerErrors = { ...this.state.registerErrors };
                registerErrors.error = 'Teacher major should not be empty';
                this.setState({ registerErrors });
                return;
            }

            const { registerName, registerEmail, registerPassword } =
                this.state.data;

            const teacher = {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
                isModerator: true,
                majorId: this.state.major,
            };
            this.props.addTeacher(teacher);
            this.props.submitted();
            toast.success('تم اضافة طلب انشاء حساب معلم بنجاح');
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
            <div>
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
                        انشاء حساب معلم
                    </h2>
                    <ErrorMessage error={this.state.registerErrors.error} />
                    {this.renderInput(
                        'registerName',
                        'اسم المستخدم',
                        'username',
                        email
                    )}
                    {this.renderInput('registerEmail', 'الايميل', 'email', email)}
                    <div>{lock} كلمة المرور</div>
                    {this.renderPasswordInput('registerPassword')}

                    <DropDown
                        handleChange={this.handleChangeDropDown}
                        val={this.state.major}
                        error={this.state.errors.major}
                        majors={this.props.majors}
                    />

                    {this.renderButton('طلب انشاء حساب معلم', false)}
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    teachers: state.entities.teachers.list,
});

const mapDispatchToProps = (dispatch) => ({
    addTeacher: (data) => dispatch(addTeacher(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherAddForm);
