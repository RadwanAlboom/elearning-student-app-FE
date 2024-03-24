import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';

import { loadAdminCourses } from '../../store/adminCourses';

import Card from '../../components/user/Card';
import auth from '../../services/authService';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Courses = () => {
    const dispatch = useDispatch();

    const courses = useSelector((state) => state.entities.adminCourses.list);

    useEffect(() => {
        dispatch(loadAdminCourses());
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('courses', (payload) => {
            dispatch(loadAdminCourses());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const displayCourses = courses.map((course) => {
        return auth.getCurrentUser().majorId + '' === course.id + '' ? (
            <div
                key={course.id}
                style={{
                    marginRight: '100px',
                    marginBottom: '40px',
                }}
                className="card-mid"
            >
                <Card
                    id={course.id}
                    title={course.name}
                    descreption={course.description}
                    img={course.image}
                    url="/moderator/courses/teachers"
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
                    Courses
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
                {displayCourses}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Courses;
