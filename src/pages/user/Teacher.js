import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loadTeachers, getTeachers } from '../../store/teachers';
import { getMajor } from '../../store/adminCourses';
import TeacherCard from '../../components/admin/teacherCard';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Teacher = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [courseId, setCourseId] = useState('');

    const teachers = useSelector(getTeachers(courseId));
    const major = useSelector(getMajor(courseId));

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
        socket.on('acceptTeacher', (payload) => {
            dispatch(loadTeachers());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const displayTeachers = teachers.map((teacher) => {
        return (
            <div
                key={teacher.id}
                style={{
                    marginRight: '100px',
                    marginBottom: '40px',
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
                <h3>Teachers</h3>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '40px',
                }}
                className="course-mid"
            >
                {displayTeachers}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Teacher;
