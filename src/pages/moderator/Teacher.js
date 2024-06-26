import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';

import TeacherCard from '../../components/moderator/teacherCard';
import auth from '../../services/authService';

import { loadTeachers, getTeachers } from '../../store/teachers';
import { getMajor } from '../../store/adminCourses';
import RequestLoader from '../../components/RequestLoader';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Teacher = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [courseId, setCourseId] = useState('');

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
        socket.on('acceptTeacher', (payload) => {
            dispatch(loadTeachers());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const displayTeachers = teachers.map((teacher) => {
        return teacher.id + '' === auth.getCurrentUser().id + '' ? (
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
                    url="/moderator/courses/teachers/classCourses"
                />
            </div>
        ) : (
            ''
        );
    });

    return (
        <div className="admin-courses">
            <div className="courses-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={'1.7rem'}
                        color="#803bec"
                        style={{
                            marginRight: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    المعلمين
                </h3>
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
                { isLoading && <RequestLoader width={160} height={160}/>}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Teacher;
