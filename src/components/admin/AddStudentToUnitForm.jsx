import React from "react";
import Joi from "joi-browser";
import { IoMail } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import Form from "../form";

class AddStudentToUnitForm extends Form {
    state = {
        data: {
            id: this.props.studentId + "",
            paymentAmount: 0,
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label("المعرف"),
        paymentAmount: Joi.number()
            .min(0)
            .max(1000000)
            .required()
            .label("قيمة الدفع"),
    };

    doSubmit = () => {
        this.props.submitted(this.state.data.paymentAmount);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("id", "المعرف", "text", "", true)}
                    <div style={{ fontSize: "1.5rem" }}>
                        هل انت متاكد انك تريد اضافة هذا الطالب؟
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ order: 3 }}>
                            <IoMail
                                style={{ marginLeft: "10px" }}
                                size={"30px"}
                            />
                        </div>
                        <div style={{ marginLeft: "5px", order: 2 }}>
                            :البريد
                        </div>
                        <div style={{ order: 1 }}>
                            {this.props.studentEmail}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ order: 4 }}>
                            <BsCashCoin
                                style={{
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                }}
                                size={"30px"}
                            />
                        </div>
                        <div style={{ marginLeft: "5px", order: 3 }}>
                            :الدفع
                        </div>
                        <div style={{ order: 2 }}>
                            {this.renderInput("paymentAmount", "")}
                        </div>
                        <div style={{ marginRight: "5px", order: 1 }}>شيقل</div>
                    </div>
                    {this.renderButton(`اضافة طالب`, false)}
                </form>
            </div>
        );
    }
}

export default AddStudentToUnitForm;
