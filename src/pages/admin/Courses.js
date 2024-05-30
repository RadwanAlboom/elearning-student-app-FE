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
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import {uploadImage, handleDeleteFile} from "../../services/uploadService";

import {
    loadAdminCourses,
    addAdminCourse,
    deleteAdminCourse,
    updateAdminCourse,
} from '../../store/adminCourses';
import RequestLoader from '../../components/RequestLoader';

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
    const[progress, setProgress] = useState(0)
    const[clicked, setClicked] = useState(false);
    const [imageId, setImageId] = useState('');

    const courses = useSelector((state) => state.entities.adminCourses.list);
    const isLoading = useSelector((state) => state.entities.adminCourses.loading);

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
        setFormTitle('تحديث المساق');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setCourseFormShow(false);
        setCourseId(id);
        setImageId(course.imageId);
    };

    const deleteClicked = (id, course) => {
        setFormTitle('حذف المساق');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setCourseFormShow(false);
        setCourseId(id);
        setImageId(course.imageId)
    };

    const addClicked = () => {
        setFormTitle('مساق جديد');
        setModalShow(true);
        setCourseFormShow(true);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
    };

    const handleAddSubmitted = async ({coursename, description, img}) => {
        setClicked(true);

        try {
            const {data} = await uploadImage(img, setProgress);
            dispatch(addAdminCourse({coursename, description, url: data.secure_url, publicId: data.public_id}));
            toast.success('تم اضافة المساق بنجاح');
        } catch(ex) {
            console.log(ex);
        }

        setModalShow(false);
        setProgress(0);
        setClicked(false);
    };

    const handleUpdateSubmitted = async ({coursename, description, img}) => {
        setClicked(true);
        
        try {
            if (img) {
                const {data} = await uploadImage(img, setProgress);
                dispatch(updateAdminCourse(courseId, {coursename, description, url: data.secure_url, publicId: data.public_id}));
                handleDeleteFile(imageId);
            } else {
                dispatch(updateAdminCourse(courseId, {coursename, description, url: '', publicId: ''}));
            }
            toast.success('تم تحديث المساق بنجاح');
        } catch(ex) {
            console.log(ex);
        }

        setModalShow(false);
        setProgress(0);
        setClicked(false);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        handleDeleteFile(imageId);
        dispatch(deleteAdminCourse(courseId));
        toast.success('تم حذف المساق بنجاح');
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
                progress={progress}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {courseFormShow && (
                    <CourseForm
                        submitted={handleAddSubmitted}
                        btnName={'اضافة مساق'}
                        clicked={clicked}
                        imageId={imageId}
                    />
                )}
                {updateFormShow && (
                    <UpdateForm
                        id={courseId}
                        btnName={'تحديث المساق'}
                        submitted={handleUpdateSubmitted}
                    />
                )}
                {deleteFormShow && (
                    <DeleteForm
                        id={courseId}
                        btnName={'حذف المساق'}
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
                    المساقات
                </h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    اضافة مساق
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
                { isLoading && <RequestLoader width={160} height={160}/>}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Courses;
