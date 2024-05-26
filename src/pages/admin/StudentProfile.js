import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import MotionHoc from "./MotionHoc";
import IconButton from "@material-ui/core/IconButton";
import { FaUserTie } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
import auth from "../../services/authService";
import Messanger from "../Massenger";

import { loadProfile } from "../../store/studentProfile";
import "../moderator/profile.css";
import userImg from "../../assets/user.png";

const StudentProfileComponent = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [showMessanger, setShowMessanger] = useState(false);
    const [studentId, setStudentId] = useState("");

    const profile = useSelector((state) => state.studentProfile.list);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadProfile(location.state.studentId));
    }, [dispatch]);

    useEffect(() => {
        console.log(location.state);
        setStudentId(location.state.studentId);
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
                                    auth.getCurrentUser().isModerator && (
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
                                        :الطالب
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
                        receiverId={studentId}
                    />
                )}
            </div>
        </div>
    );
};

const StudentProfile = MotionHoc(StudentProfileComponent);

export default StudentProfile;
