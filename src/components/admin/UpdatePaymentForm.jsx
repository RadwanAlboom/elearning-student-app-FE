import React from "react";
import Joi from "joi-browser";
import { IoMail } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import Form from "../form";

class UpdatePaymentForm extends Form {
    state = {
        data: {
            id: this.props.action.chapterId + "-" + this.props.action.userId,
            paymentAmount: "",
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label("معرف القيمة"),
        paymentAmount: Joi.number()
            .min(0)
            .max(1000000)
            .required()
            .label("قيمة الدفع"),
    };

    doSubmit = () => {
        this.props.submitted(
            this.props.action.chapterId,
            this.props.action.userId,
            this.state.data.paymentAmount
        );
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("id", "معرف القيمة", "text", "", true)}
                    <div style={{ fontSize: "1.5rem" }}>
                        هل انت متاكد انك تريد تحديث هذه القيمة؟
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ order: 3 }}>
                            <FaUserTie
                                style={{ marginLeft: "10px" }}
                                size={"30px"}
                            />
                        </div>
                        <div style={{ marginLeft: "5px", order: 2 }}>
                            :الطالب
                        </div>
                        <div style={{ order: 1 }}>
                            {this.props.student.name}
                        </div>
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
                            {this.props.student.email}
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
                            {this.props.action.payment}
                        </div>
                        <div style={{ marginRight: "5px", order: 1 }}>شيقل</div>
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
                            :القيمة الجديدة
                        </div>
                        <div style={{ order: 2 }}>
                            {this.renderInput("paymentAmount", "")}
                        </div>
                        <div style={{ marginRight: "5px", order: 1 }}>شيقل</div>
                    </div>
                    {this.renderButton("تحديث القيمة", false)}
                </form>
            </div>
        );
    }
}

export default UpdatePaymentForm;
