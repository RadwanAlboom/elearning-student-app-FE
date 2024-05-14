import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import MotionHoc from "./MotionHoc";
import IconButton from "@material-ui/core/IconButton";
import { FaUserTie } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { BsXDiamondFill } from "react-icons/bs";
import { FaFacebookMessenger } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import Messanger from "../Massenger";
import auth from "../../services/authService";

import { loadTeacherProfile } from "../../store/profile";
import "../moderator/profile.css";
import userImg from "../../assets/user.jpg";

const ProfileComponent = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [showMessanger, setShowMessanger] = useState(false);
    const [teacherId, setTeacherId] = useState("");

    const profile = useSelector((state) => state.profile.teacher);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadTeacherProfile(location.state.teacherId));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        setTeacherId(location.state.teacherId);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        setShowMessanger(!showMessanger);
    };

    const handleCloseClick = () => {
        setShowMessanger(false);
    };
    return (
        <div style={{ height: "95vh", width: "100%", overflowY: "auto" }}>
            <div className="profile-container">
                <div className="profile-subcontainer">
                    <div className="top-left-triangle"></div>
                    <div className="bottom-left-triangle"></div>
                    <div className="top-right-triangle"></div>
                    <div className="bottom-right-triangle"></div>
                    <IconButton>
                        <div className="circle">
                            <img
                                src={profile.image ? profile.image : userImg}
                                alt="user"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </IconButton>
                    <div
                        style={{
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                        }}
                        className="teacher-profile-contact-method"
                    >
                        <div className="control-container">
                            <div>
                                {auth.getCurrentUser() &&
                                    !auth.getCurrentUser().isModerator && (
                                        <IconButton onClick={handleClick}>
                                            <FaFacebookMessenger
                                                size="50px"
                                                color="#803bec"
                                                style={{
                                                    backgroundColor: "white",
                                                    borderRadius: "10px",
                                                    padding: "5px",
                                                }}
                                            />
                                        </IconButton>
                                    )}
                            </div>
                        </div>
                        <a
                            href={
                                profile.whatsapp && profile.whatsapp !== ""
                                    ? profile.whatsapp
                                    : "https://wa.me/970592078053"
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "5px",
                                    marginRight: "12px",
                                }}
                            >
                                <RiWhatsappFill size="40px" color="green"/>
                            </div>
                        </a>
                        <a
                            href={
                                profile.facebook && profile.facebook !== ""
                                    ? profile.facebook
                                    : ""
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    padding: "5px",
                                }}
                            >
                                <FaFacebook size="40px" />
                            </div>
                        </a>
                        <h5 style={{ marginLeft: "10px", color: "white" }}>
                            :للتواصل
                        </h5>
                    </div>
                    <div className="info-control-container">
                        <div className="info-container">
                            <div
                                style={{ width: "100%", fontSize: "20px" }}
                                className="profile-info"
                            >
                                <div>
                                    <span
                                        style={{
                                            float: "right",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        :المعلم
                                        <FaUserTie
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </span>
                                    <span>{profile.name}</span>
                                </div>
                                <div>
                                    <span
                                        style={{
                                            float: "right",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        :التخصص
                                        <BsXDiamondFill
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </span>
                                    <span>{profile.major}</span>
                                </div>
                                <div>
                                    <span
                                        style={{
                                            float: "right",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        :البريد
                                        <IoMail
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </span>
                                    <span>{profile.email}</span>
                                </div>
                                <div>
                                    <span
                                        style={{
                                            float: "right",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        :الهاتف
                                        <FaPhone
                                            style={{ marginLeft: "10px" }}
                                        />
                                    </span>
                                    <span>{profile.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showMessanger && (
                    <Messanger
                        handleCloseClick={handleCloseClick}
                        teacherId={teacherId}
                    />
                )}
            </div>
        </div>
    );
};

const Profile = MotionHoc(ProfileComponent);

export default Profile;
