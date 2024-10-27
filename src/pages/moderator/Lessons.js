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
import {uploadPdfFile, handleDeleteFile} from "../../services/uploadService";
import auth from '../../services/authService';

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

    const { window: wind } = { ...other };
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
    const [linkId, setLinkId] = useState('');
    const [activeLink, setActiveLink] = useState(null);
    const [link, setLink] = useState('');
    const [pdf, setPdf] = useState('');
    const [counter, setCounter] = useState(0);
    const [isPdf, setIsPdf] = useState(false);
    const[progress, setProgress] = useState(0)
    const[clicked, setClicked] = useState(false);

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
        const {id} = location.state;
        setChapterId(id);
        dispatch(loadLessons(id));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const {id} = location.state;
        dispatch(loadExams(id));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const {id} = location.state;
        dispatch(loadFiles(id));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        const {id} = location.state;
        socket.on('lessons', (payload) => {
            dispatch(loadLessons(id));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        const {id} = location.state;
        socket.on('exams', (payload) => {
            dispatch(loadExams(id));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        const {id} = location.state;
        socket.on('files', (payload) => {
            dispatch(loadFiles(id));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const updateClicked = (id, lesson) => {
        setLessonId(id);
        setFormTitle('تحديث محاضرة');
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
        setFormTitle('حذف محاضرة');
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
        setMobileOpen(false);
        setFormTitle('حذف امتحان');
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
        setMobileOpen(false);
        setLessonId(id);
        setFormTitle('اضافة محاضرة جديدة');
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
        setMobileOpen(false);
        setFormTitle('جديد PDF ملف');
        setModalShow(true);
        setAddPDFFormShow(true);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setDeletePDFFormShow(false);
        setUpdatePDFFormShow(false);
    };

    const updatePDFClicked = (id, linkId) => {
        setFileId(id);
        setFormTitle('PDF تحديث ملف');
        setUpdatePDFFormShow(true);
        setModalShow(true);
        setDeletePDFFormShow(false);
        setAddPDFFormShow(false);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setLinkId(linkId);
    };

    const deletePDFClicked = (id, linkId) => {
        setFileId(id);
        setFormTitle('PDF حذف ملف');
        setModalShow(true);
        setDeletePDFFormShow(true);
        setAddPDFFormShow(false);
        setAddFormShow(false);
        setDeleteFormShow(false);
        setUpdateFormShow(false);
        setDeleteExamFormShow(false);
        setUpdatePDFFormShow(false);
        setLinkId(linkId);
    };

    const handleAddSubmitted = async (newLesson) => {
        setModalShow(false);
        dispatch(addLesson(newLesson, chapterId));
        toast.success('تم اضافة المحاضرة بنجاح');
    };

    const cancelUploading = () => {
        setProgress(0);
        setModalShow(false);
    };

    const handleUpdatedSubmitted = async (updatedLesson) => {
        setModalShow(false);
        dispatch(updateLesson(lessonId, updatedLesson));
        toast.success('تم تحديث المحاضرة بنجاح');
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        dispatch(deleteLesson(lessonId));
        toast.success('تم حذف المحاضرة بنجاح');
    };

    const handleClick = (link) => {
        auth.authMe();
        setLink(link);
        setIsPdf(false);
    };

    const handlePDFClick = (link, linkId) => {
        auth.authMe();
        setPdf(link);
        setIsPdf(true);
        setLinkId(linkId);
    };


    const addPDFSubmitted = async ({name, pdfFile}) => {
        setClicked(true);

        try {
            const {data} = await uploadPdfFile(pdfFile, setProgress);
            dispatch(addFile({name, url: data.secure_url, publicId: data.public_id}, chapterId));
            toast.success('تم اضافة الملف بنجاح');
        } catch(ex) {
            console.log(ex);
        }

        setModalShow(false);
        setProgress(0);
        setClicked(false);
    };

    const UpdatePDFSubmitted = async ({name, linkId, pdfFile}) => {
        setClicked(true);
        
        try {
            if (pdfFile) {
                const {data} = await uploadPdfFile(pdfFile, setProgress);
                dispatch(updateFile(fileId, {name, url: data.secure_url, publicId: data.public_id}));
                handleDeleteFile(linkId);
            } else {
                dispatch(updateFile(fileId, {name, url: '', publicId: ''}));
            }
            toast.success('تم تحديث الملف بنجاح');
        } catch(ex) {
            console.log(ex);
        }

        setModalShow(false);
        setProgress(0);
        setClicked(false);
    };

    const handleDeletePDFSubmitted = (linkId) => {
        setModalShow(false);
        handleDeleteFile(linkId);
        dispatch(deleteFile(fileId));
        toast.success('تم حذف الملف بنجاح');
    };

    const addExamClicked = () => {
        setMobileOpen(false);
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
        setMobileOpen(false);
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

        toast.success('تم حذف الامتحان بنجاح');
    };

    const handleActiveClick = (type, id) => {
        setMobileOpen(false);
        setActiveLink(type + id);
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
                <h3 style={{ margin: 0, fontWeight: 'bold', marginLeft: '20px' }}>المحاضرات</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addClicked}
                >
                    اضافة محاضرة جديدة
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
                        setActiveLink('lesson' + lesson.id);
                        setCounter(index + 1);
                    }
                    return chapterId + '' === lesson.chapter_id + '' ? (
                        <div
                            key={lesson.id}
                            style={{ display: 'flex', alignItems: 'center', wordWrap: 'break-word' }}
                            onClick={() => handleActiveClick('lesson', lesson.id)}
                            className={
                                'lesson' + lesson.id === activeLink ? ' active-link' : ''
                            }
                        >
                            <div style={{display: 'flex', alignItems: 'center', wordBreak: 'break-word',width: '100%'}}>
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
                                <div style={{display: 'flex'}}>
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
                <h3 style={{ margin: 0, fontWeight: 'bold', marginLeft: '20px'}}>الملفات</h3>
                <Button
                    variant="contained"
                    color="secondary"
                    className={`${classes.button} add-btn`}
                    startIcon={<AddCircleSharpIcon />}
                    onClick={addFileClicked}
                >
                    اضافة ملف جديد
                </Button>
            </div>
            <Divider />
            <List>
                {files.map((file) => {
                    return (
                        <div
                            key={file.id}
                            style={{ display: 'flex', alignItems: 'center', overflowWrap: 'break-word'}}
                            onClick={() => handleActiveClick('pdf', file.id)}
                            className={
                                'pdf' + file.id === activeLink ? ' active-link' : ''
                            }
                        >
                           
                            <div style={{display: 'flex', alignItems: 'center', wordBreak: 'break-word',width: '100%'}}>
                                <ListItem
                                    button
                                    key={file.name}
                                    onClick={() => handlePDFClick(file.link, file.linkId)} 
                                >
                                    <ListItemIcon>
                                        <FaFilePdf
                                            size={'1.5rem'}
                                            color="#803bec"
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={file.name} />
                                </ListItem>
                                <div style={{display: 'flex'}}>
                                    <div
                                        onClick={() => updatePDFClicked(file.id, file.linkId)}
                                        className="on-hover updateBtn"
                                    >
                                        <CreateIcon />
                                    </div>
                                    <div
                                        onClick={() => deletePDFClicked(file.id, file.linkId)}
                                        className="on-hover deleteBtn"
                                    >
                                        <HighlightOffIcon color="inherit" />
                                    </div>
                                </div>
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
                <h3 style={{ margin: 0, fontWeight: 'bold', marginLeft: '20px' }}>الامتحانات</h3>
                {!exams.length && (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} add-btn`}
                        startIcon={<AddCircleSharpIcon />}
                        onClick={addExamClicked}
                    >
                        اضافة امتحان جديد
                    </Button>
                )}
            </div>
            <Divider />
            <List>
                {exams.map((exam) => {
                    return (
                        <div
                            key={exam.id}
                            style={{ display: 'flex', alignItems: 'center', wordBreak: 'break-word' }}
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
            <div style={{width: '100%', height:'350px'}}></div>
        </div>
    );

    const container =
        wind !== undefined ? () => wind().document.body : undefined;

    return (
        <div className={classes.root}>
            <VerticalModal
                formTitle={formTitle}
                progress={progress}
                show={modalShow}
                onHide={() => {
                    cancelUploading();
                }}
            >
                {addFormShow && (
                        <LessonAddForm
                            submitted={handleAddSubmitted}
                        />
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
                        btnName="PDF اضافة ملف"
                        submitted={addPDFSubmitted}
                        clicked={clicked}
                    />
                )}

                {updatePDFFormShow && (
                    <PDFUpdateForm
                        btnName="PDF تحديث ملف"
                        id={fileId + ''}
                        linkId={linkId}
                        submitted={UpdatePDFSubmitted}
                        clicked={clicked}
                    />
                )}

                {deletePDFFormShow && (
                    <PDFDeleteForm
                        id={fileId + ''}
                        linkId={linkId}
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
            <main id='lesson-container' className={classes.content}>
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
                    <div 
                        className="Courses-container video-conatiner" 
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: '65rem',
                                height: '40rem',
                                padding: '0 0 0 0',
                            }}
                        >
                            <iframe title='user-frame' frameborder="0" width="100%" height="100%" src={`https://drive.google.com/file/d/${link}/preview`} sandbox="allow-same-origin allow-scripts" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>
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
