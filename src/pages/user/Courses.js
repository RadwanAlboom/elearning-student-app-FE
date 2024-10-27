import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FiGrid } from "react-icons/fi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";

import Card from "../../components/user/Card";
import allAccess from "../../assets/all2.jpg";
import facebook from "../../assets/admin/facebook.svg";
import whatsapp from "../../assets/admin/whatsapp.svg";
import youtube from "../../assets/admin/youtube.svg";
import { loadAdminCourses, getCourses } from "../../store/adminCourses";
import RequestLoader from "../../components/RequestLoader";

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        [theme.breakpoints.down("sm")]: {
            display: "unset",
        },
        fontWeight: "bold",
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        overflowY: "auto",
        height: "100vh",
    },
}));

const Courses = (props) => {
    const { window } = { props };
    const dispatch = useDispatch();
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const courses = useSelector(getCourses);
    const isLoading = useSelector((state) => state.entities.adminCourses.loading);

    useEffect(() => {
        dispatch(loadAdminCourses());
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on("courses", (payload) => {
            dispatch(loadAdminCourses());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const displayCourses = courses.map((course) => {
        return (
            <div
                key={course.id}
                style={{
                    marginRight: "100px",
                    marginBottom: "40px",
                }}
                className="card-mid"
            >
                <Card
                    id={course.id}
                    title={course.name}
                    descreption={course.description}
                    img={course.image}
                    url="/courses/teachers"
                />
            </div>
        );
    });

    const drawer = (
        <div>
            <div
                className="access-card"
                style={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#0f0f15",
                }}
            >
                <img
                    src={allAccess}
                    alt="allAccess"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>

            <Divider />

            <List
                style={{
                    backgroundColor: "#deded6",
                    borderRight: "6px solid black",
                    marginTop: "20px",
                }}
            >
                <ListItem button>
                    <ListItemIcon>
                        <FiGrid size={"1.7rem"} color="#803bec" />
                    </ListItemIcon>
                    <ListItemText primary={"المساقات"} />
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
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    color: "white",
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
            <main className={`${classes.content} main-dev`}>
                {/* <div className={classes.toolbar} /> */}
                <div className="admin-courses">
                    <div className="courses-header">
                        <h3>
                            <BsFillGrid3X3GapFill
                                size={"1.7rem"}
                                color="#803bec"
                                style={{
                                    marginRight: "10px",
                                    marginBottom: "5px",
                                }}
                            />
                            المساقات
                        </h3>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginTop: "40px",
                        }}
                        className="course-mid"
                    >
                        {displayCourses}
                        { isLoading && <RequestLoader width={160} height={160}/>}
                    </div>
                    <div style={{ marginTop: "150px" }}></div>
                    <div className="bottom-container courses-bottom-wave">
                        <div className="wavy" style={{width: '0px'}}>
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
                            <a
                                href="https://wa.me/970592078053"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img alt="" src={whatsapp} height="50" />
                            </a>
                            <a
                                href="https://www.facebook.com/groups/760435298130078"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img alt="" src={facebook} height="50" />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCJKNMtpU0ABIVqLyzjeSuHw"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img alt="" src={youtube} height="50" />
                            </a>
                        </div>
                        <div className="copyright_right">
                            المبدع ©, حقوق النشر محفوظة
                        </div>
                    </div>
                </div>
            </main>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={"right"}
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

export default Courses;
