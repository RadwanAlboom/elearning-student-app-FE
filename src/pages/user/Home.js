import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import MotionHoc from "./MotionHoc";
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
import { IoHome } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";

import http from "../../services/httpService";
import Card from "../../components/user/Card";

import allAccess from "../../assets/all2.jpg";
import homeImg from "../../assets/learn.jpg";
import simple from "../../assets/simple.png";
import time from "../../assets/time.png";
import slides from "../../assets/slides.png";
import book from "../../assets/admin/book.png";
import facebook from "../../assets/admin/facebook.svg";
import whatsapp from "../../assets/admin/whatsapp.svg";
import youtube from "../../assets/admin/youtube.svg";

import "./wave.css";

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

let backendURL = process.env.REACT_APP_API_URL;

const HomeComponent = (props) => {
    const { window } = { props };
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [randomCourses, setRandomCourses] = useState([]);

    useEffect(() => {
        const isSuccessRegister = localStorage.getItem('isSuccessRegister');
        if (isSuccessRegister) {
            toast.success('تم إرسال طلب الإنظمام الى المسؤول بنجاح');
            localStorage.removeItem('isSuccessRegister');
        }
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
                key={course.id + ""}
                style={{
                    marginRight: "100px",
                    marginBottom: "40px",
                    marginLeft: "10px",
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
                        <IoHome size={"1.7rem"} color="#803bec" />
                    </ListItemIcon>
                    <ListItemText primary={"الصفحة الرئيسية"} />
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
            <main className={classes.content}>
                <div className="home-wrraper" style={{ paddingTop: "20px" }}>
                    <div
                        className="home-container"
                        style={{
                            backgroundColor: "white",
                            width: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <div className="home-image">
                            <img className="image" alt="" src={homeImg} />
                            <div className="logo-container">
                                <img className="home-logo" alt="" src={book} />
                                <div className="home-logo-text">
                                    <h2>المبدع للتعليم الإلكتروني</h2>
                                    <div
                                        className="img-text"
                                        style={{
                                            fontSize: "30px",
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        واضح وموجز وشامل، وعملي بدون زغب
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-courses">
                            <h3 style={{ fontWeight: "bold" }}>
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginRight: "10px" }}
                                />
                                واضح وموجز وشامل
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginLeft: "10px" }}
                                />
                            </h3>
                        </div>
                        <div className="user-friendly">
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: "#dc43c6",
                                        marginBottom: "10px",
                                        fontSize: "30px",
                                    }}
                                >
                                    دروس خطوة بخطوة
                                </div>
                                <h4 style={{ fontWeight: "bold" }}>
                                    بسيط وصديق للطلاب
                                </h4>
                                <div style={{ fontSize: "20px" }}>
                                    المبدع يتميز بقدرته على كسر المواضيع المعقدة
                                    إلى بسيطة وسهلة الهضم ودروس يمكن لأي طالب أن
                                    يفهمها
                                </div>
                            </div>
                            <div className="simple-img">
                                <img alt="" src={simple} />
                            </div>
                        </div>
                        <div className="user-friendly part-2">
                            <div className="simple-img">
                                <img alt="" src={time} />
                            </div>
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: "#dc43c6",
                                        marginBottom: "10px",
                                        fontSize: "30px",
                                    }}
                                >
                                    تتبع تعلمك بسرعة
                                </div>
                                <h4 style={{ fontWeight: "bold" }}>
                                    دروس واضحة وموجزة
                                </h4>
                                <div style={{ fontSize: "20px" }}>
                                    لا تضيعوا المزيد من الوقت على المدى الطويل،
                                    دروس المبدع موجزة، مناسبة وبسيطة
                                </div>
                            </div>
                        </div>

                        <div className="user-friendly">
                            <div className="simple-text">
                                <div
                                    style={{
                                        color: "#dc43c6",
                                        marginBottom: "10px",
                                        fontSize: "30px",
                                    }}
                                >
                                    مقاطع فيديو ذات جودة عالمية
                                </div>
                                <h4 style={{ fontWeight: "bold" }}>
                                    دروس ممتعة وجذابة
                                </h4>
                                <div style={{ fontSize: "20px" }}>
                                    المبدع هو منشد الكمال وهو كامل مهووس بجودة
                                    مقاطع الفيديو الخاصة، به رسومات جميلة،
                                    والشرائح، والرسوم المتحركة تساعدك على
                                    الاستمرار في التركيز، والتذكر، وأفضل في فهم
                                    المواد
                                </div>
                            </div>
                            <div className="simple-img">
                                <img alt="" src={slides} />
                            </div>
                        </div>
                        <div className="about-courses" style={{marginTop: "40px"}}>
                            <h3 style={{ fontWeight: "bold" }}>
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginRight: "10px" }}
                                />
                                اقتبس من اليوم
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginLeft: "10px" }}
                                />
                            </h3>
                        </div>
                        <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
                            <div class="blockquote">
                                <h1>
                                    لا تتوقف عن التعلم، لأن الحياة لا تتوقف عن
                                    التعليم. كل يوم هو فرصة لتعلم شيء جديد
                                </h1>
                                <h4>المبدع للتعليم الإلكتروني &mdash;</h4>
                            </div>
                        </div>
                        <div className="about-courses">
                            <h3 style={{ fontWeight: "bold" }}>
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginRight: "10px" }}
                                />
                                المساقات المقترحة
                                <FaBrain
                                    size={"1.7rem"}
                                    color="black"
                                    style={{ marginLeft: "10px" }}
                                />
                            </h3>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                className="right-space"
                                style={{
                                    width: "calc(27% - 15%)",
                                    height: "10px",
                                }}
                            ></div>
                            <div
                                className="align-mid"
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    marginTop: "40px",
                                    justifyContent: "center",
                                    width: "100%",
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
                    <div className="home-empty-bottom"></div>
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

const Home = MotionHoc(HomeComponent);

export default Home;
