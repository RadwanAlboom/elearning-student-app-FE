import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';

import VerticalModal from '../../components/admin/verticalModel';
import TeacherAddForm from '../../components/admin/teacherAddForm';
import TeacherCard from '../../components/admin/teacherCard';

import { loadTeachers, getTeachers } from '../../store/teachers';
import { getMajor } from '../../store/adminCourses';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));
const Teacher = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);
    const [addFormShow, setAddFormShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
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

    const addClicked = () => {
        setFormTitle('New Teacher');
        setModalShow(true);
        setAddFormShow(true);
    };

    const submitted = () => {
        setModalShow(false);
    };

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
                    url="/admin/courses/teachers/classCourses"
                />
            </div>
        );
    });

    return (
        <div className="admin-courses">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {addFormShow && (
                    <TeacherAddForm submitted={submitted} majors={major} />
                )}
            </VerticalModal>
            <div className="courses-header">
                <h3>Teachers</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    Add Teacher
                </Button>
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
