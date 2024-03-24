import React, { useState, useEffect, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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
import { FcOk } from 'react-icons/fc';
import { FaFilePdf } from 'react-icons/fa';
import ReactPlayer from 'react-player';

import auth from '../../services/authService';
import http from '../../services/httpService';
import PDFReader from './../../components/PDFReader';

import { loadLessons } from '../../store/lessons';
import { loadExams } from '../../store/exams';
import { loadFiles } from '../../store/files';

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

function Lessons({ match, ...other }) {
    let location = useLocation();
    let history = useHistory();
    let dispatch = useDispatch();
    const { window } = { ...other };
    const classes = useStyles();
    const [examsUser, setExamsUser] = useState([]);
    const [userId, setUserId] = useState(0);
    const [chapterId, setChapterId] = useState('');
    const [classCourseId, setClassCourseId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
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
        setClassCourseId(location.state.classCourseId);
        setTeacherId(location.state.teacherId);
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

    const fetchUserExams = useCallback(async () => {
        setUserId(auth.getCurrentUser().id);
        const { data: userExams } = await http.get(
            `${backendURL}/api/form/user/exampreviews/${userId}`
        );
        setExamsUser(userExams);
    }, [userId]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('files', (payload) => {
            dispatch(loadFiles());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        fetchUserExams();
    }, [userId, fetchUserExams]);

    const handleClick = (link) => {
        setLink(link);
        setIsPdf(false);
    };

    const handlePDFClick = (link) => {
        setPdf(link);
        setIsPdf(true);
    };

    const examClicked = (id) => {
        const add_URI = `/courses/teachers/classCourses/chapters/exams`;
        history.push({
            pathname: add_URI,
            state: {
                id,
                classCourseId,
                teacherId,
            },
        });
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
            </div>
            <Divider />
            <List>
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <ListItem
                            button
                            key={exam.id}
                            onClick={() => examClicked(exam.id)}
                        >
                            <ListItemIcon>
                                <RiNewspaperFill
                                    size={'1.5rem'}
                                    color="#803bec"
                                />
                            </ListItemIcon>
                            <ListItemText primary={exam.name} />
                        </ListItem>
                        {examsUser.map(
                            (examUser, index) =>
                                examUser.exam_id === exam.id &&
                                examUser.status === 1 && (
                                    <div
                                        key={index}
                                        style={{ marginRight: '10px' }}
                                    >
                                        <div>
                                            <FcOk size="1.5rem" />
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                ))}
            </List>
            <Divider />
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Toolbar
                style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
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
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <ReactPlayer
                                url={link}
                                playing={true}
                                width="100%"
                                height="100%"
                                controls
                                onContextMenu={(e) => e.preventDefault()}
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

export default Lessons;
