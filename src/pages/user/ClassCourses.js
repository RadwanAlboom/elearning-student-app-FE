import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
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
import { FiGrid } from 'react-icons/fi';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';

import { loadClassCourses } from '../../store/classCourses';

import Card from '../../components/user/Card';
import allAccess from '../../assets/all2.jpg';

const drawerWidth = 350;

let socket;
let backendURL = process.env.REACT_APP_API_URL;

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

const ClassCourses = ({ match, ...other }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { window } = { ...other };
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [teacherId, setTeacherId] = useState('');

    const classCourses = useSelector(
        (state) => state.entities.classCourses.list
    );

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadClassCourses());
        setTeacherId(location.state.teacherId);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('classCourses', (payload) => {
            dispatch(loadClassCourses());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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
                    teacherId={teacherId}
                    title={classCourse.name}
                    descreption={classCourse.description}
                    img={classCourse.image}
                    url="/courses/teachers/classCourses/chapters"
                />
            </div>
        ) : (
            ''
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
                    <ListItemText primary={'Included Class Courses'} />
                    <ListItemIcon>
                        <FiGrid size={'1.7rem'} color="#803bec" />
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
                {/* <div className={classes.toolbar} /> */}
                <div className="admin-courses">
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
                            Class Courses
                        </h3>
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

export default ClassCourses;
