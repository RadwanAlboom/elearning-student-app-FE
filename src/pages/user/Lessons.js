import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'react-lottie';
import { FcInfo } from "react-icons/fc";
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
import GetAppIcon from '@material-ui/icons/GetApp';

import auth from '../../services/authService';
import http from '../../services/httpService';
import PDFReader from './../../components/PDFReader';
import musicEqualizer from '../../assets/admin/music_equalizer.json';

import { loadLessons } from '../../store/lessons';
import { loadExams } from '../../store/exams';
import { loadFiles } from '../../store/files';
import { socketMsg } from '../../socket';
import RequestLoader from '../../components/RequestLoader';

const drawerWidth = 400;
let socket;
let backendURL = process.env.REACT_APP_API_URL;

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: musicEqualizer,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

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
    const [type, setType] = useState('');
    const [pdf, setPdf] = useState('');
    const [isPdf, setIsPdf] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

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
        const {id, classCourseId, teacherId} = location.state;
        setChapterId(id);
        setClassCourseId(classCourseId);
        setTeacherId(teacherId);
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
        const {id} = location.state;
        socketMsg.on('refreshStudentUnits', (data) => {
            dispatch(loadLessons(id));
            dispatch(loadExams(id));
            dispatch(loadFiles(id));
        });

        socketMsg.on('refreshLessonsPage', (data) => {
            dispatch(loadLessons(id));
        })
    }, []);

    useEffect(() => {
        const {id} = location.state;
        socketMsg.on('refreshLessonsPage', (data) => {
            dispatch(loadLessons(id));
        })
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

    const fetchUserExams = useCallback(async () => {
        setUserId(auth.getCurrentUser().id);
        const { data: userExams } = await http.get(
            `${backendURL}/api/form/user/exampreviews/${userId}`
        );
        setExamsUser(userExams);
    }, [userId]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        const {id} = location.state;
        socket.on('files', (payload) => {
            dispatch(loadFiles(id));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        fetchUserExams();
    }, [userId, fetchUserExams]);

    const handleClick = (link, type) => {
        setIsLoading(true);
        auth.authMe();
        setMobileOpen(false);
        setLink(link);
        setIsLoading(false);
        setType(type);
        setIsPdf(false);
    };

    const handlePDFClick = (link) => {
        auth.authMe();
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

    const downloadClicked = (pdfLink) => {
    
        const aLink = document.createElement("a");
        aLink.href = pdfLink;
        aLink.target = "https://www.google.com/";
        aLink.download = "document.pdf"; // specify the filename
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
    }

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
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold'}}>المحاضرات</h3>
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
                        setType(lesson.type);
                        setActiveLink('lesson' + lesson.id);
                        setCounter(index + 1);
                    }
                    return chapterId + '' === lesson.chapter_id + '' ? (
                        <div
                            key={lesson.id}
                            style={{ display: 'flex', alignItems: 'center', wordBreak: 'break-word'}}
                            onClick={() => handleActiveClick('lesson', lesson.id)}
                            className={
                                'lesson' + lesson.id === activeLink ? ' active-link' : ''
                            }
                        >
                            <ListItem
                                button
                                key={lesson.name}
                                onClick={() => handleClick(lesson.link, lesson.type)}
                            >
                                <ListItemIcon>
                                    {
                                        'lesson' + lesson.id === activeLink ? (
                                            <Lottie options={defaultOptions} height={50} width={50} />
                                        ) : (
                                            <MdOndemandVideo
                                                size={'1.5rem'}
                                                color="#803bec"
                                            />
                                        )
                                    }
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>الملفات</h3>
            </div>
            <Divider />
            <List>
                {files.map((file) => {
                    return (
                        <div
                            key={file.id}
                            style={{ display: 'flex', alignItems: 'center', wordWrap: 'break-word' }}
                            onClick={() => handleActiveClick('pdf', file.id)}
                            className={
                                'pdf' + file.id === activeLink ? ' active-link' : ''
                            }
                        >
                            <div style={{display: 'flex', alignItems: 'center', wordBreak: 'break-word',width: '100%'}}>
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
                                    onClick={() => downloadClicked(file.link)}
                                    className="on-hover updateBtn"
                                >
                                    <GetAppIcon />
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>الامتحانات</h3>
            </div>
            <Divider />
            <List>
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        style={{ display: 'flex', alignItems: 'center', wordWrap: 'break-word' }}
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
            <div style={{width: '100%', height:'350px'}}></div>
        </div>
    );



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
                    <>
                        <div className='video-support'>
                            <div className='video-info'><FcInfo size='1.5rem'/></div>
                            <div>
                            اذا واجهتك أي مشكلة اثناء تشغيل الفيديو قم بالتواصل معنا عبر <a className='video-info-ref' href="https://wa.me/970592078053" target="_blank" rel="noreferrer" style={{textDecoration: 'underline'}}>الواتساب</a> 
                            </div>
                        </div>
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
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                {type === 'drive' && (
                                    <iframe title='user-frame' frameBorder="0" width="100%" height="100%" src={`https://drive.google.com/file/d/${link}/preview`} sandbox="allow-same-origin allow-scripts" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>
                                )}

                                {type === 'vimeo' && (
                                    <iframe
                                        src={`https://player.vimeo.com/video/${link}`}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title="user-frame"
                                    ></iframe>
                                )}

                                {(!type || type === '' || isLoading) && <RequestLoader width={160} height={160}/>}
                            </div>
                        </div>
                    </>
                )}
            </main>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <Drawer
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
