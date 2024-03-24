import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { MdOndemandVideo } from 'react-icons/md';
import { RiNewspaperFill } from 'react-icons/ri';
import { FaFilePdf } from 'react-icons/fa';
import CreateIcon from '@material-ui/icons/Create';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';

import VerticalModal from '../../components/admin/verticalModel';
import LessonAddForm from '../../components/admin/lessonAddForm';
import LessonUpdateForm from '../../components/admin/lessonUpdateForm';
import LessonDeleteForm from '../../components/admin/lessonDeleteForm';
import ExamDeleteForm from '../../components/admin/examDeleteForm';
import PDFAddForm from '../../components/admin/pdfAddForm';
import PDFDeleteForm from './../../components/admin/pdfDeleteForm';
import PDFUpdateForm from '../../components/admin/pdfUpdateForm';
import PDFReader from './../../components/PDFReader';

import {
    loadLessons,
    addLesson,
    updateLesson,
    deleteLesson,
} from '../../store/lessons';

import { loadExams, deleteExam } from '../../store/exams';
import { loadFiles, addFile, deleteFile, updateFile } from '../../store/files';

const drawerWidth = 400;
let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'unset',
        },
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        overflowY: 'auto',
        height: '100vh',
    },
}));

function ResponsiveDrawer({ match, ...other }) {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { window } = { ...other };
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [addFormShow, setAddFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [addPDFFormShow, setAddPDFFormShow] = useState(false);
    const [deletePDFFormShow, setDeletePDFFormShow] = useState(false);
    const [updatePDFFormShow, setUpdatePDFFormShow] = useState(false);
    const [deleteExamFormShow, setDeleteExamFormShow] = useState(false);
    const [chapterId, setChapterId] = useState('');
    const [lessonId, setLessonId] = useState('');
    const [examId, setExamId] = useState('');
    const [fileId, setFileId] = useState('');
    const [activeLink, setActiveLink] = useState(null);
    const [counter, setCounter] = useState(0);
    const [link, setLink] = useState('');
    const [pdf, setPdf] = useState('');
    const [isPdf, setIsPdf] = useState(false);

    const lessons = useSelector((state) =>
        state.entities.lessons.list.filter(
            (lesson) => lesson.chapter_id + '' === chapterId + ''
        )
    );
    const exams = useSelector((state) =>
        state.entities.exams.list.filter(
            (exam) => exam.chapter_id === chapterId
        )
    );

    const files = useSelector((state) =>
        state.entities.files.list.filter(
            (file) => file.chapter_id === chapterId
        )
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setChapterId(location.state.id);
        dispatch(loadLessons());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(loadExams());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(loadFiles());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('lessons', (payload) => {
            dispatch(loadLessons());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('exams', (payload) => {
            dispatch(loadExams());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('files', (payload) => {
            dispatch(loadFiles());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const updateClicked = (id, lesson) => {
        setLessonId(id);
        setFormTitle('Update Lesson');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setAddFormShow(false);
        setDeleteExamFormShow(false);
        setAddPDFFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const deleteClicked = (id, lesson) => {
        setLessonId(id);
        setFormTitle('Delete Lesson');
        setModalShow(true);
        setDeleteFormShow(true);
        setAddFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setAddPDFFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const deleteExamClicked = (id) => {
        setFormTitle('Delete Exam');
        setExamId(id);
        setModalShow(true);
        setDeleteExamFormShow(true);
        setDeleteFormShow(false);
        setAddFormShow(false);
        setUpdateFormShow(false);
        setAddPDFFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const addClicked = (id) => {
        setLessonId(id);
        setFormTitle('New Lesson');
        setModalShow(true);
        setAddFormShow(true);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setAddPDFFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const addFileClicked = () => {
        setFormTitle('New PDF File');
        setModalShow(true);
        setAddPDFFormShow(true);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const updatePDFClicked = (id) => {
        setFileId(id);
        setFormTitle('Update PDF File');
        setUpdatePDFFormShow(true);
        setModalShow(true);
        setDeletePDFFormShow(false);
        setAddPDFFormShow(false);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
    };

    const deletePDFClicked = (id) => {
        setFileId(id);
        setFormTitle('Delete PDF File');
        setModalShow(true);
        setDeletePDFFormShow(true);
        setAddPDFFormShow(false);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const handleAddSubmitted = async (newLesson) => {
        setModalShow(false);
        dispatch(addLesson(newLesson, chapterId));
        toast.success('Lesson added successfully');
    };

    const handleUpdatedSubmitted = async (updatedLesson) => {
        setModalShow(false);
        dispatch(updateLesson(lessonId, updatedLesson));
        toast.success('Lesson updated successfully');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteLesson(lessonId));
        toast.success('Lesson deleted successfully');
    };

    const handleClick = (link) => {
        setLink(link);
        setIsPdf(false);
    };

    const handlePDFClick = (link) => {
        setPdf(link);
        setIsPdf(true);
    };

    const addPDFSubmitted = (newFile) => {
        setModalShow(false);
        dispatch(addFile(newFile, chapterId));
        toast.success('File added successfully');
    };

    const handleDeletePDFSubmitted = () => {
        setModalShow(false);
        dispatch(deleteFile(fileId));
        toast.success('Exam deleted successfully');
    };

    const UpdatePDFSubmitted = (updatedFile) => {
        setModalShow(false);
        dispatch(updateFile(fileId, updatedFile));
        toast.success('Exam updated successfully');
    };

    const addExamClicked = () => {
        const add_URI = `/moderator/courses/teachers/classCourses/chapters/exams`;
        history.push({
            pathname: add_URI,
            state: {
                isEdit: false,
                id: chapterId,
            },
        });
    };

    const updateExamClicked = (id) => {
        const add_URI = `/moderator/courses/teachers/classCourses/chapters/exams`;
        history.push({
            pathname: add_URI,
            state: {
                isEdit: true,
                examId: id,
                id: chapterId,
            },
        });
    };

    const deleteExamSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteExam(examId));

        toast.success('Exam deleted successfully');
    };

    const handleActiveClick = (id) => {
        setActiveLink(id);
    };
    const drawer = (
        <div>
            <div
                className={classes.toolbar}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>Lectures</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    Add lecture
                </Button>
            </div>
            <Divider />
            <List>
                {lessons.map((lesson, index) => {
                    if (
                        index === 0 &&
                        counter === 0 &&
                        chapterId + '' === lesson.chapter_id + ''
                    ) {
                        setLink(lesson.link);
                        setActiveLink(lesson.id);
                        setCounter(index + 1);
                    }
                    return chapterId + '' === lesson.chapter_id + '' ? (
                        <div
                            key={lesson.id}
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => handleActiveClick(lesson.id)}
                            className={
                                lesson.id === activeLink ? ' active-link' : ''
                            }
                        >
                            <ListItem
                                button
                                key={lesson.name}
                                onClick={() => handleClick(lesson.link)}
                            >
                                <ListItemIcon>
                                    <MdOndemandVideo
                                        size={'1.5rem'}
                                        color="#803bec"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={lesson.name} />
                            </ListItem>
                            <div
                                onClick={() => updateClicked(lesson.id, lesson)}
                                className="on-hover updateBtn"
                            >
                                <CreateIcon />
                            </div>
                            <div
                                onClick={() => deleteClicked(lesson.id, lesson)}
                                className="on-hover deleteBtn"
                            >
                                <HighlightOffIcon color="inherit" />
                            </div>
                        </div>
                    ) : (
                        ''
                    );
                })}
            </List>
            <Divider />
            <div
                className={classes.toolbar}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>Files</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addFileClicked}
                >
                    Add PDF
                </Button>
            </div>
            <Divider />
            <List>
                {files.map((file) => {
                    return (
                        <div
                            key={file.id}
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => handleActiveClick(file.id)}
                            className={
                                file.id === activeLink ? ' active-link' : ''
                            }
                        >
                            <ListItem
                                button
                                key={file.name}
                                onClick={() => handlePDFClick(file.link)}
                            >
                                <ListItemIcon>
                                    <FaFilePdf
                                        size={'1.5rem'}
                                        color="#803bec"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={file.name} />
                            </ListItem>

                            <div
                                onClick={() => updatePDFClicked(file.id)}
                                className="on-hover updateBtn"
                            >
                                <CreateIcon />
                            </div>

                            <div
                                onClick={() => deletePDFClicked(file.id)}
                                className="on-hover deleteBtn"
                            >
                                <HighlightOffIcon color="inherit" />
                            </div>
                        </div>
                    );
                })}
            </List>
            <Divider />
            <div
                className={classes.toolbar}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>Exams</h3>
                {!exams.length && (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} add-btn`}
                        startIcon={<AddCircleSharpIcon />}
                        onClick={addExamClicked}
                    >
                        Add Exam
                    </Button>
                )}
            </div>
            <Divider />
            <List>
                {exams.map((exam) => {
                    return (
                        <div
                            key={exam.id}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <ListItem
                                button
                                key={exam.id}
                                onClick={() => updateExamClicked(exam.id)}
                            >
                                <ListItemIcon>
                                    <RiNewspaperFill
                                        size={'1.5rem'}
                                        color="#803bec"
                                    />
                                </ListItemIcon>
                                <ListItemText primary={exam.name} />
                            </ListItem>
                            <div
                                onClick={() => updateExamClicked(exam.id)}
                                className="on-hover updateBtn"
                            >
                                <CreateIcon />
                            </div>
                            <div
                                onClick={() => deleteExamClicked(exam.id)}
                                className="on-hover deleteBtn"
                            >
                                <HighlightOffIcon color="inherit" />
                            </div>
                        </div>
                    );
                })}
            </List>
            <Divider />
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {addFormShow && (
                    <LessonAddForm submitted={handleAddSubmitted} />
                )}
                {updateFormShow && (
                    <LessonUpdateForm
                        id={lessonId}
                        submitted={handleUpdatedSubmitted}
                    />
                )}

                {deleteFormShow && (
                    <LessonDeleteForm
                        id={lessonId}
                        submitted={handleDeleteSubmitted}
                    />
                )}

                {deleteExamFormShow && (
                    <ExamDeleteForm
                        id={examId}
                        submitted={deleteExamSubmitted}
                    />
                )}

                {addPDFFormShow && (
                    <PDFAddForm
                        btnName="Add PDF File"
                        submitted={addPDFSubmitted}
                    />
                )}

                {updatePDFFormShow && (
                    <PDFUpdateForm
                        btnName="Update PDF File"
                        id={fileId + ''}
                        submitted={UpdatePDFSubmitted}
                    />
                )}

                {deletePDFFormShow && (
                    <PDFDeleteForm
                        id={fileId + ''}
                        submitted={handleDeletePDFSubmitted}
                    />
                )}
            </VerticalModal>
            <CssBaseline />
            <Toolbar
                style={{
                    position: 'absolute',
                    top: '0px',
                    right: '10px',
                    color: 'white',
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
            <main className={classes.content}>
                {isPdf && (
                    <div className="Courses-container file-container">
                        <div
                            style={{
                                position: 'relative',
                                width: '65rem',
                                padding: '0 0 0 0',
                            }}
                        >
                            <PDFReader pdf={pdf} />
                        </div>
                    </div>
                )}
                {!isPdf && (
                    <div className="Courses-container video-conatiner">
                        <div
                            style={{
                                position: 'relative',
                                width: '65rem',
                                height: '40rem',
                                padding: '0 0 0 0',
                            }}
                        >
                            <ReactPlayer
                                url={link}
                                playing={true}
                                width="100%"
                                height="100%"
                                controls
                            />
                        </div>
                    </div>
                )}
            </main>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={'right'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;
