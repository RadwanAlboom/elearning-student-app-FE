import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loadTeachers, getTeachers } from "../../store/teachers";
import { getMajor } from "../../store/adminCourses";
import TeacherCard from "../../components/admin/teacherCard";
import { BsFillGrid3X3GapFill } from "react-icons/bs";

import facebook from "../../assets/admin/facebook.svg";
import whatsapp from "../../assets/admin/whatsapp.svg";
import youtube from "../../assets/admin/youtube.svg";
import RequestLoader from "../../components/RequestLoader";

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Teacher = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [courseId, setCourseId] = useState("");

    const teachers = useSelector(getTeachers(courseId));
    const major = useSelector(getMajor(courseId));
    const isLoading = useSelector((state) => state.entities.teachers.loading);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setCourseId(location.state.id);
        dispatch(loadTeachers());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on("acceptTeacher", (payload) => {
            dispatch(loadTeachers());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const displayTeachers = teachers.map((teacher) => {
        return (
            <div
                key={teacher.id}
                style={{
                    marginRight: "100px",
                    marginBottom: "40px",
                }}
                className="card-mid"
            >
                <TeacherCard
                    id={teacher.id}
                    courseId={location.state.id}
                    name={teacher.name}
                    email={teacher.email}
                    major={major[0].name}
                    img={major[0].image}
                    url="/courses/teachers/classCourses"
                />
            </div>
        );
    });

    return (
        <div className="admin-courses">
            <div className="courses-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={"1.7rem"}
                        color="#803bec"
                        style={{
                            marginRight: "10px",
                            marginBottom: "5px",
                        }}
                    />
                    المعلمين
                </h3>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "40px",
                }}
                className="course-mid"
            >
                {displayTeachers}
                { isLoading && <RequestLoader width={160} height={160}/>}
            </div>
            <div style={{ marginTop: "150px" }}></div>
            <div className="bottom-container courses-bottom-wave">
                <div className="wavy" style={{width: '0px'}}>
                    <div className="waveWrapperInner bgTop">
                        <div className="wave waveTop"></div>
                    </div>
                    <div className="waveWrapperInner bgMiddle">
                        <div className="wave waveMiddle"></div>
                    </div>
                    <div className="waveWrapperInner bgBottom">
                        <div className="wave waveBottom"></div>
                    </div>
                </div>
                <div className="social-icons">
                    <a
                        href="https://wa.me/970592078053"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img alt="" src={whatsapp} height="50" />
                    </a>
                    <a
                        href="https://www.facebook.com/groups/760435298130078"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img alt="" src={facebook} height="50" />
                    </a>
                    <a
                        href="https://www.youtube.com/channel/UCJKNMtpU0ABIVqLyzjeSuHw"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img alt="" src={youtube} height="50" />
                    </a>
                </div>
                <div className="copyright_right">
                    المبدع ©, حقوق النشر محفوظة
                </div>
            </div>
        </div>
    );
};

export default Teacher;
