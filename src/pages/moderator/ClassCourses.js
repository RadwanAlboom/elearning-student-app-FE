import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { toast } from 'react-toastify';

import Card from '../../components/admin/Card';
import VerticalModal from '../../components/admin/verticalModel';
import CourseForm from '../../components/admin/courseForm';
import UpdateForm from '../../components/admin/updateForm';
import DeleteForm from '../../components/admin/deleteForm.jsx';

import {
    loadClassCourses,
    addClassCourse,
    updateClassCourse,
    deleteClassCourse,
} from '../../store/classCourses';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

const ClassCourses = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);
    const [courseFormShow, setCourseFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [classCourseId, setClassCourseId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [courseId, setCourseId] = useState('');

    const classCourses = useSelector(
        (state) => state.entities.classCourses.list
    );

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadClassCourses());
        setTeacherId(location.state.teacherId);
        setCourseId(location.state.courseId);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('classCourses', (payload) => {
            dispatch(loadClassCourses());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const updateClicked = (id, course) => {
        setFormTitle('Update Class Course');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setCourseFormShow(false);
        setClassCourseId(id);
    };

    const deleteClicked = (id, course) => {
        setFormTitle('Delete Class Course');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setCourseFormShow(false);
        setClassCourseId(id);
    };

    const addClicked = () => {
        setFormTitle('New Class Course');
        setModalShow(true);
        setCourseFormShow(true);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
    };

    const handleAddSubmitted = async (newclassCourse) => {
        setModalShow(false);
        dispatch(addClassCourse(newclassCourse, courseId, teacherId));

        toast.success('Class course added successfully');
    };

    const handleUpdateSubmitted = async (updatedClassCourse) => {
        setModalShow(false);
        dispatch(updateClassCourse(classCourseId, updatedClassCourse));
        toast.success('Class course updated successfully');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteClassCourse(classCourseId));
        toast.success('Class course deleted successfully');
    };
    const displayClassCourses = classCourses.map((classCourse) => {
        return teacherId + '' === classCourse.teacher_id + '' ? (
            <div
                key={classCourse.id}
                style={{
                    marginRight: '100px',
                    marginBottom: '40px',
                }}
                className="card-mid"
            >
                <Card
                    course={classCourse}
                    id={classCourse.id}
                    title={classCourse.name}
                    descreption={classCourse.description}
                    img={classCourse.image}
                    url="/moderator/courses/teachers/classCourses/chapters"
                    updateClicked={updateClicked}
                    deleteClicked={deleteClicked}
                />
            </div>
        ) : (
            ''
        );
    });

    return (
        <div className="admin-courses">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {courseFormShow && (
                    <CourseForm
                        submitted={handleAddSubmitted}
                        btnName={'Add Class Course'}
                    />
                )}
                {updateFormShow && (
                    <UpdateForm
                        id={classCourseId}
                        btnName={'Update Class Course'}
                        submitted={handleUpdateSubmitted}
                    />
                )}
                {deleteFormShow && (
                    <DeleteForm
                        id={classCourseId}
                        btnName={'Delete Class Course'}
                        submitted={handleDeleteSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="courses-header">
                <h3>Class Courses</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    Add class course
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
                {displayClassCourses}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default ClassCourses;
