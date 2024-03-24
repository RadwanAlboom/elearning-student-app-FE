import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { toast } from 'react-toastify';

import http from '../../services/httpService';
import VerticalModal from '../../components/admin/verticalModel';
import ChapterAddForm from '../../components/admin/chapterAddForm';
import ChapterDeleteForm from '../../components/admin/chapterDeleteForm';
import ChapterUpdateForm from '../../components/admin/chapterUpdateForm';
import Unit from '../../components/admin/unit.jsx';
import DropDownLevel from '../../components/dropDownLevel';

import { loadUnits, addUnit, updateUnit, deleteUnit } from '../../store/units';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const Units = ({ match }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [addFormShow, setAddFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [classCourseId, setClassCourseId] = useState('');
    const [classCourseName, setClassCourseName] = useState('');
    const [value, setValue] = useState('');

    const chapters = useSelector((state) => state.entities.units.list);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadUnits());
        setClassCourseId(location.state.id);
        setClassCourseName(location.state.classCourseName);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        fetchActive();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchActive = async () => {
        try {
            const { data } = await http.get(
                `${backendURL}/api/courses/classCourses/active/${location.state.id}`
            );
            setValue(data.value);
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('chapters', (payload) => {
            dispatch(loadUnits());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const updateClicked = (id, chapter) => {
        setFormTitle('Update Chapter');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setAddFormShow(false);
        setChapterId(id);
    };

    const deleteClicked = (id, chapter) => {
        setFormTitle('Delete Chapter');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setAddFormShow(false);
        setChapterId(id);
    };

    const addClicked = () => {
        setFormTitle('New Chapter');
        setModalShow(true);
        setAddFormShow(true);
        setUpdateFormShow(false);
        setDeleteFormShow(false);
    };

    const handleAddSubmitted = async (newChapter) => {
        setModalShow(false);
        dispatch(addUnit(newChapter, classCourseId));
        toast.success('Chapter added successfully');
    };

    const handleUpdatedSubmitted = async (updatedUnit) => {
        setModalShow(false);
        dispatch(updateUnit(chapterId, updatedUnit));
        toast.success('Chapter updated successfully');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteUnit(chapterId));
        toast.success('Chapter deleted successfully');
    };

    const displayChapters = chapters.map((chapter) => {
        return classCourseId + '' === chapter.classcourse_id + '' ? (
            <div
                key={chapter.id}
                style={{
                    marginBottom: '40px',
                }}
            >
                <Unit
                    id={chapter.id}
                    chapter={chapter}
                    title={chapter.name}
                    color="white"
                    component={<AiOutlineMenuFold size="2rem" color="white" />}
                    updateClicked={updateClicked}
                    deleteClicked={deleteClicked}
                    url="/admin/courses/teachers/classCourses/chapters/lessons"
                />
            </div>
        ) : (
            ''
        );
    });

    const handleZoomClick = () => {
        history.push({
            pathname: '/admin/zoomLink',
            state: {
                classCourseId,
                classCourseName,
            },
        });
    };

    const handleChange = async (event) => {
        setValue(event.target.value);
        try {
            await http.put(
                `${backendURL}/api/courses/classCourses/active/${classCourseId}`,
                { value: event.target.value }
            );
            toast.success('Status updated successfully');
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <div className="admin-courses">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {addFormShow && (
                    <ChapterAddForm submitted={handleAddSubmitted} />
                )}
                {updateFormShow && (
                    <ChapterUpdateForm
                        id={chapterId}
                        submitted={handleUpdatedSubmitted}
                    />
                )}
                {deleteFormShow && (
                    <ChapterDeleteForm
                        id={chapterId}
                        submitted={handleDeleteSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="courses-header">
                <h3>Chapters</h3>
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} add-btn`}
                        startIcon={<AddCircleSharpIcon />}
                        onClick={addClicked}
                    >
                        Add chapter
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} add-btn`}
                        startIcon={<AddCircleSharpIcon />}
                        onClick={handleZoomClick}
                    >
                        Add Zoom Link
                    </Button>
                </div>
            </div>
            <div className="exam-drop" style={{ marginTop: '15px' }}>
                <DropDownLevel handleChange={handleChange} val={value} />
            </div>
            <div
                style={{
                    marginTop: '40px',
                }}
            >
                {displayChapters}
            </div>
            <div style={{ marginTop: '50px' }}></div>
        </div>
    );
};

export default Units;
