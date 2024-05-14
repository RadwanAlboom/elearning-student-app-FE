import React from "react";
import { FaFacebook } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { BsXDiamondFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import userImg from "../assets/user.jpg";

const CardCarousel = ({
    name,
    major,
    email,
    whatsapp,
    facebook,
    phone,
    image,
}) => {
    return (
        <div className="card-carousel-content">
            <div className="image">
                <img src={image && image != "" ? image : userImg} alt="" />
            </div>
            <div className="media-icons">
                <a
                    href={facebook && facebook !== "" ? facebook : ""}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaFacebook size="30px" className="media-icon" />
                </a>
                <a
                    href={
                        whatsapp && whatsapp !== ""
                            ? whatsapp
                            : "https://wa.me/970592078053"
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    <RiWhatsappFill
                        size="35px"
                        className="media-icon"
                        color="green"
                    />
                </a>
            </div>
            <div className="person">
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ order: 3 }}>
                        <FaUserTie style={{ marginLeft: "10px" }} />
                    </div>
                    <div style={{ marginLeft: "5px", order: 2 }}>:المعلم</div>
                    <div style={{ order: 1 }}>{name}</div>
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ order: 3 }}>
                        <BsXDiamondFill style={{ marginLeft: "10px" }} />
                    </div>
                    <div style={{ marginLeft: "5px", order: 2 }}>:التخصص</div>
                    <div style={{ order: 1 }}>{major}</div>
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ order: 3 }}>
                        <IoMail style={{ marginLeft: "10px" }} />
                    </div>
                    <div style={{ marginLeft: "5px", order: 2 }}>:البريد</div>
                    <div style={{ order: 1 }}>{email}</div>
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ order: 3 }}>
                        <FaPhone style={{ marginLeft: "10px" }} />
                    </div>
                    <div style={{ marginLeft: "5px", order: 2 }}>:الهاتف</div>
                    <div style={{ order: 1 }}>{phone}</div>
                </div>
            </div>
        </div>
    );
};

export default CardCarousel;
