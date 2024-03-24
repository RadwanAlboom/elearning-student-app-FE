import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../../components/admin/Card';
import VerticalModal from '../../components/admin/verticalModel';
import CourseForm from '../../components/admin/courseForm';
import UpdateForm from '../../components/admin/updateForm';
import DeleteForm from '../../components/admin/deleteForm.jsx';

import {
    loadAdminCourses,
    addAdminCourse,
    deleteAdminCourse,
    updateAdminCourse,
} from '../../store/adminCourses';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Courses = () => {
    const dispatch = useDispatch();

    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);
    const [courseFormShow, setCourseFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [courseId, setCourseId] = useState('');

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

    const updateClicked = (id, course) => {
        setFormTitle('Update Course');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setCourseFormShow(false);
        setCourseId(id);
    };

    const deleteClicked = (id, course) => {
        setFormTitle('Delete Course');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setCourseFormShow(false);
        setCourseId(id);
    };

    const addClicked = () => {
        setFormTitle('New Course');
        setModalShow(true);
        setCourseFormShow(true);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
    };

    const handleAddSubmitted = async (newCourse) => {
        setModalShow(false);
        dispatch(addAdminCourse(newCourse));
        toast.success('Course added successfully');
    };

    const handleUpdateSubmitted = async (updateCourse) => {
        setModalShow(false);
        dispatch(updateAdminCourse(courseId, updateCourse));

        toast.success('Course updated successfully');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteAdminCourse(courseId));
        toast.success('Course deleted successfully');
    };
    const displayCourses = courses.map((course) => {
        return (
            <div
                key={course.id}
                style={{
                    marginRight: '100px',
                    marginBottom: '40px',
                }}
                className="card-mid"
            >
                <Card
                    course={course}
                    id={course.id}
                    title={course.name}
                    descreption={course.description}
                    img={course.image}
                    updateClicked={updateClicked}
                    deleteClicked={deleteClicked}
                    url="/admin/courses/teachers"
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
                {courseFormShow && (
                    <CourseForm
                        submitted={handleAddSubmitted}
                        btnName={'Add Course'}
                    />
                )}
                {updateFormShow && (
                    <UpdateForm
                        id={courseId}
                        btnName={'Update Course'}
                        submitted={handleUpdateSubmitted}
                    />
                )}
                {deleteFormShow && (
                    <DeleteForm
                        id={courseId}
                        btnName={'Delete Course'}
                        submitted={handleDeleteSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="courses-header">
                <h3>Courses</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    Add course
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
                {displayCourses}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Courses;
