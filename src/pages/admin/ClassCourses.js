import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
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
        setFormTitle('تحديث مساق مخصص');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setCourseFormShow(false);
        setClassCourseId(id);
    };

    const deleteClicked = (id, course) => {
        setFormTitle('حذف مساق مخصص');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setCourseFormShow(false);
        setClassCourseId(id);
    };

    const addClicked = () => {
        setFormTitle('مساق مخصص جديد');
        setModalShow(true);
        setCourseFormShow(true);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
    };

    const handleAddSubmitted = async (newclassCourse) => {
        setModalShow(false);
        dispatch(addClassCourse(newclassCourse, courseId, teacherId));

        toast.success('تم اضافة المساق المخصص بنجاح');
    };

    const handleUpdateSubmitted = async (updatedClassCourse) => {
        setModalShow(false);
        dispatch(updateClassCourse(classCourseId, updatedClassCourse));
        toast.success('تم تحديث المساق المخصص بنجاح');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteClassCourse(classCourseId));
        toast.success('تم حذف المساق المخصص بنجاح');
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
                    url="/admin/courses/teachers/classCourses/chapters"
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
                        btnName={'اضافة مساق مخصص'}
                    />
                )}
                {updateFormShow && (
                    <UpdateForm
                        id={classCourseId}
                        btnName={'تحديث مساق مخصص'}
                        submitted={handleUpdateSubmitted}
                    />
                )}
                {deleteFormShow && (
                    <DeleteForm
                        id={classCourseId}
                        btnName={'حذف مساق مخصص'}
                        submitted={handleDeleteSubmitted}
                    />
                )}
            </VerticalModal>
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
                    المساقات المخصصة
                </h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    اضافة مساق مخصص
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
