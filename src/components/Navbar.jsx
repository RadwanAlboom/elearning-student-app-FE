import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { FaFacebookMessenger } from "react-icons/fa";
import Upload from "../components/upload";
import circle from "../assets/admin/circle.json";

import { loadNotifications } from "../store/userNotifications";
import { loadRequests } from "../store/requests";
import Notifications from "../pages/user/Notifications";
import MsgNotifications from "../pages/MsgNotifications";
import auth from "../services/authService";
import { socketMsg } from "../socket";
import { addMessage } from "../store/messages";
import {
    addPersonOnChat,
    loadMsgNotifications,
} from "../store/msgNotifications";

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
    sectionDesktop: {
        display: "none",
        marginRight: "60px",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    sectionMobile: {
        display: "flex",
        marginRight: "60px",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
}));

export default function PrimarySearchAppBar({ user }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [anchorElNot, setAnchorElNot] = React.useState(null);
    const [anchorMsgElNot, setMsgAnchorElNot] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const dispatch = useDispatch();
    const userNotificationsNotOpend = useSelector((state) =>
        state.userNotifications.list.filter((notify) => !notify.open)
    );

    const userMsgNotificationsNotOpend = useSelector((state) =>
        state.msgNotifications.list.filter((notify) => notify.counter)
    );

    useEffect(() => {
        socketMsg.on("imageUpdated", (data) => {
            if (auth.getCurrentUser()) {
                dispatch(loadMsgNotifications(auth.getCurrentUser().id));
            }
        });
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);

        socket.on("teachers", ({ id }) => {
            if (
                auth.getCurrentUser() &&
                auth.getCurrentUser().isModerator &&
                auth.getCurrentUser().id + "" === id + ""
            ) {
                auth.logout();
            }
        });
        socket.on("students", ({ id }) => {
            if (
                auth.getCurrentUser() &&
                !auth.getCurrentUser().isModerator &&
                auth.getCurrentUser().id + "" === id + ""
            ) {
                auth.logout();
            }
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socketMsg.on("getMessage", (data) => {
            dispatch(addMessage(data.savedMsg));
            // dispatch(addPersonOnChat(data.person));
        });
    }, [dispatch]);

    useEffect(() => {
        socketMsg.on("getMessage", (data) => {
            data.person.me = false;
            dispatch(addPersonOnChat(data.person));
        });
    }, [dispatch]);

    useEffect(() => {
        socketMsg.on("senderMessage", (data) => {
            dispatch(addMessage(data.savedMsg));
        });
    }, [dispatch]);

    useEffect(() => {
        socketMsg.on("senderMessage", (data) => {
            data.sender.me = true;
            dispatch(addPersonOnChat(data.sender));
        });
    }, [dispatch]);

    useEffect(() => {
        //user or admin or teacher
        if (auth.getCurrentUser()) {
            dispatch(loadNotifications());
        }
    }, [dispatch]);

    useEffect(() => {
        const socketFraud = socketIOClient(backendURL);
        socketFraud.on("fraudNotification", (payload) => {
            const user = auth.getCurrentUser();
            if (user.isAdmin) {
                dispatch(loadNotifications());
            }
        });

        return () => socketFraud.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on("openNotification", (payload) => {
            dispatch(loadNotifications());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on("insertRequestNotification", (payload) => {
            dispatch(loadNotifications());
            dispatch(loadRequests());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleClick = (event) => {
        setAnchorElNot(event.currentTarget);
    };

    const handleMsgClick = (event) => {
        setMsgAnchorElNot(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElNot(null);
    };

    const handleMsgClose = () => {
        setMsgAnchorElNot(null);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {!user && (
                <NavLink
                    to="/registration"
                    style={{ textDecoration: "none", color: "black" }}
                >
                    <MenuItem onClick={handleMenuClose}>تسجيل الدخول</MenuItem>
                </NavLink>
            )}
            {user && (
                <div>
                    <NavLink
                        to={
                            user.isAdmin
                                ? "/admin/profile"
                                : user.isModerator
                                ? "/moderator/profile"
                                : "/user/profile"
                        }
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            الملف الشخصي
                        </MenuItem>
                    </NavLink>
                    <NavLink
                        to="/logout"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            تسجيل الخروج
                        </MenuItem>
                    </NavLink>
                </div>
            )}
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <div onClick={handleMsgClick}>
                <MenuItem>
                    <IconButton
                        aria-label="show 4 new mails"
                        color="inherit"
                        onClick={handleMsgClick}
                    >
                        <Badge
                            badgeContent={userMsgNotificationsNotOpend.length}
                            color="secondary"
                        >
                            <FaFacebookMessenger
                                color="black"
                                size={'23px'}
                            />
                        </Badge>
                    </IconButton>
                    <p style={{marginBottom: '0px'}}>المحادثات</p>
                </MenuItem>
            </div>
            <div onClick={handleClick}>
                <MenuItem>
                    <IconButton
                        aria-label="show 11 new notifications"
                        color="inherit"
                    >
                        <Badge
                            badgeContent={userNotificationsNotOpend.length}
                            color="secondary"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <p style={{marginBottom: '0px'}}>الاشعارات</p>
                </MenuItem>
            </div>

            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p style={{marginBottom: '5px'}}>الملف الشخصي</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <Notifications handleClose={handleClose} anchorEl={anchorElNot} />
            <MsgNotifications
                handleClose={handleMsgClose}
                anchorEl={anchorMsgElNot}
            />

            <AppBar position="static" style={{ backgroundColor: "#0f0f15" }}>
                <Toolbar>
                    <Upload lotti={circle} height={60} width={200} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}></div>
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            aria-label="show 4 new mails"
                            color="inherit"
                            onClick={handleMsgClick}
                        >
                            <Badge
                                badgeContent={
                                    userMsgNotificationsNotOpend.length
                                }
                                color="secondary"
                            >
                                <FaFacebookMessenger
                                    color="white"
                                    size={'23px'}
                                />
                            </Badge>
                        </IconButton>
                        <IconButton
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleClick}
                        >
                            <Badge
                                badgeContent={userNotificationsNotOpend.length}
                                color="secondary"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
