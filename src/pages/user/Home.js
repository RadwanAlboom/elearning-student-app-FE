import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Obfuscate from 'react-obfuscate';
import MotionHoc from './MotionHoc';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IoHome } from 'react-icons/io5';
import { FaBrain } from 'react-icons/fa';

import http from '../../services/httpService';
import Card from '../../components/user/Card';

import allAccess from '../../assets/all2.jpg';
import homeImg from '../../assets/learn.jpg';
import simple from '../../assets/simple.png';
import time from '../../assets/time.png';
import slides from '../../assets/slides.png';
import logo from '../../assets/admin/logo.svg';
import facebook from '../../assets/admin/facebook.svg';
import twitter from '../../assets/admin/twittersvg.svg';
import youtube from '../../assets/admin/youtube.svg';

import './wave.css';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'unset',
        },
        fontWeight: 'bold',
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
        overflowY: 'auto',
        height: '100vh',
    },
}));

let backendURL = process.env.REACT_APP_API_URL;

const HomeComponent = (props) => {
    const { window } = { props };
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [randomCourses, setRandomCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const { data } = await http.get(`${backendURL}/api/courses/getRandom`);
        setRandomCourses(data);
    };
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const displayCourses = randomCourses.map((course) => {
        return (
            <div
                key={course.id + ''}
                style={{
                    marginRight: '100px',
                    marginBottom: '40px',
                }}
                className="home-card"
            >
                <Card
                    id={course.id}
                    title={course.name}
                    descreption={course.description}
                    img={course.image}
                    url="/courses"
                />
            </div>
        );
    });

    const drawer = (
        <div>
            <div
                className="access-card"
                style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#0f0f15',
                }}
            >
                <img
                    src={allAccess}
                    alt="allAccess"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>

            <Divider />

            <List
                style={{
                    backgroundColor: '#deded6',
                    borderRight: '6px solid black',
                    marginTop: '20px',
                }}
            >
                <ListItem button>
                    <ListItemText primary={'Home Page'} />
                    <ListItemIcon>
                        <IoHome size={'1.7rem'} color="#803bec" />
                    </ListItemIcon>
                </ListItem>
            </List>
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
                <div className="admin-courses" style={{ paddingTop: '20px' }}>
                    <div
                        className="home-container"
                        style={{
                            backgroundColor: 'white',
                            width: '100%',
                        }}
                    >
                        <div className="home-image">
                            <img className="image" alt="" src={homeImg} />
                            <div className="logo-container">
                                <img className="home-logo" alt="" src={logo} />
                                <div>
                                    <h2>Done-With-It</h2>
                                    <div
                                        className="img-text"
                                        style={{
                                            fontSize: '15px',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        Clear, Concise, Comprehensive, and
                                        Practical with No Fluff!
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-courses">
                            <h4 style={{ fontWeight: 'bold' }}>
                                <FaBrain
                                    size={'1.7rem'}
                                    color="black"
                                    style={{ marginRight: '10px' }}
                                />
                                Clear, Concise, Comprehensive, and Practical
                                with No Fluff!
                                <FaBrain
                                    size={'1.7rem'}
                                    color="black"
                                    style={{ marginLeft: '10px' }}
                                />
                            </h4>
                        </div>
                        <div className="user-friendly">
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: '#dc43c6',
                                        marginBottom: '10px',
                                    }}
                                >
                                    STEP-BY-STEP LESSONS
                                </div>
                                <h4 style={{ fontWeight: 'bold' }}>
                                    Simple and Beginner friendly
                                </h4>
                                <div>
                                    Time and time again, Done-With-It students
                                    praise his ability to break down complex
                                    topics into simple, easily digestible
                                    lessons that anyone can understand.
                                </div>
                            </div>
                            <div className="simple-img">
                                <img alt="" src={simple} />
                            </div>
                        </div>
                        <div className="user-friendly">
                            <div className="simple-img">
                                <img alt="" src={time} />
                            </div>
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: '#dc43c6',
                                        marginBottom: '10px',
                                    }}
                                >
                                    FAST-TRACK YOUR LEARNING
                                </div>
                                <h4 style={{ fontWeight: 'bold' }}>
                                    Clear and Concise Lessons
                                </h4>
                                <div>
                                    Don't waste any more time on long,
                                    repetitive, and poorly-structured courses.
                                    Done-With-It lessons are concise, right to
                                    the point, and free of rambling and
                                    unnecessary buzzwords. Everything explained
                                    in plain English.
                                </div>
                            </div>
                        </div>

                        <div className="user-friendly">
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: '#dc43c6',
                                        marginBottom: '10px',
                                    }}
                                >
                                    WORLD-CLASS QUALITY VIDEOS
                                </div>
                                <h4 style={{ fontWeight: 'bold' }}>
                                    Fun and Engaging Lessons
                                </h4>
                                <div>
                                    Donw-With-It is a perfectionist and is fully
                                    obsessed with the quality of his videos.
                                    Beautiful graphics, slides, and animations
                                    help you stay focused, remember, and better
                                    understand the materials.
                                </div>
                            </div>
                            <div className="simple-img">
                                <img alt="" src={slides} />
                            </div>
                        </div>
                        <div className="about-courses">
                            <h4 style={{ fontWeight: 'bold' }}>
                                <FaBrain
                                    size={'1.7rem'}
                                    color="black"
                                    style={{ marginRight: '10px' }}
                                />
                                Included Courses
                                <FaBrain
                                    size={'1.7rem'}
                                    color="black"
                                    style={{ marginLeft: '10px' }}
                                />
                            </h4>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div
                                className="right-space"
                                style={{
                                    width: 'calc(27% - 10%)',
                                    height: '10px',
                                }}
                            ></div>
                            <div
                                className="align-mid"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    marginTop: '40px',
                                    justifyContent: 'center',
                                }}
                            >
                                {displayCourses}
                            </div>
                        </div>
                        <div className="bottom-container">
                            <div className="wavy">
                                <div className="waveWrapperInner bgTop">
                                    <div className="wave waveTop"></div>
                                </div>
                                <div className="waveWrapperInner bgMiddle">
                                    <div className="wave waveMiddle"></div>
                                </div>
                                <div className="waveWrapperInner bgBottom">
                                    <div className="wave waveBottom"></div>
                                </div>
                            </div>
                            <div className="social-icons">
                                <a href="https://www.facebook.com/profile.php?id=100004004016123">
                                    <img alt="" src={facebook} height="50" />
                                </a>
                                <a href="https://twitter.com/AlboomRadwan">
                                    <img alt="" src={twitter} height="50" />
                                </a>
                                <a href="https://www.youtube.com/channel/UCJKNMtpU0ABIVqLyzjeSuHw">
                                    <img alt="" src={youtube} height="50" />
                                </a>
                            </div>
                            <div className="copyright_right">
                                © Done-With-It, Copyright 2021 All Right
                                Reserved
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '80px' }}></div>
                </div>
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
};

const Home = MotionHoc(HomeComponent);

export default Home;
