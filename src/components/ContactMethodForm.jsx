import React from "react";
import Joi from "joi-browser";
import Form from "./form";

class ContactMethodForm extends Form {
    state = {
        fileName: "Choose File...",
        file: "",
        data: {
            whatsLink: "",
            facebookLink: "",
            phone: "",
            id: this.props.id + "",
        },
        errors: {},
    };

    schema = {
        id: Joi.string().required().label("المعرف"),
        whatsLink: Joi.string()
            .allow(null, "")
            .min(5)
            .max(255)
            .label("رابط الواتساب"),
        facebookLink: Joi.string()
            .allow(null, "")
            .min(5)
            .max(255)
            .label("رابط الفيسبوك"),
        phone: Joi.string().allow(null, '').regex(/^[0-9]+$/).min(10).max(15).label("رقم الهاتف"),
    };

    doSubmit = async () => {
        // Call the server
        const updatedContactMethod = {
            whatsLink: this.state.data.whatsLink,
            facebookLink: this.state.data.facebookLink,
            phone: this.state.data.phone,
        };
        this.props.submitted(updatedContactMethod);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("id", "المعرف", "text", "", true)}
                    {this.renderInput("whatsLink", "رابط الواتساب الجديد")}
                    {this.renderInput("facebookLink", "رابط الفيسبوك الجديد")}
                    {this.renderInput("phone", "رقم الهاتف الجديد")}
                    {this.renderButton(`${this.props.btnName}`, false)}
                </form>
            </div>
        );
    }
}

export default ContactMethodForm;
