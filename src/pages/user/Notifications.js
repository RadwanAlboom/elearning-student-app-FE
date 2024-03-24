import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { BsFillBellFill } from 'react-icons/bs';

import {
    openNotification,
    loadNotifications,
} from '../../store/userNotifications';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
    },
    typography: {
        padding: theme.spacing(2),
    },
}));

const useStyles2 = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
}));

export default function SimplePopover({ handleClose, anchorEl }) {
    const classes = useStyles();
    const classes2 = useStyles2();

    const [expanded, setExpanded] = React.useState(false);

    const notfications = useSelector((state) => state.userNotifications.list);
    const dispatch = useDispatch();

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('insertRequestNotification', (payload) => {
            dispatch(loadNotifications());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const openNotify = (id, open) => {
        if (!open) {
            dispatch(openNotification(id));
        }
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className={classes.root}>
            <Popover
                className="pop"
                style={{ width: '100%' }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => handleClose()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes2.root} style={{ position: 'relative' }}>
                    <div className="notify">
                        <BsFillBellFill
                            color="white"
                            style={{
                                marginRight: '5px',
                                marginBottom: '5px',
                            }}
                        />
                        Notifications
                    </div>
                    {notfications.map((notification) => (
                        <Accordion
                            key={notification.id}
                            expanded={expanded === `panel${notification.id}`}
                            onChange={handleChange(`panel${notification.id}`)}
                            onClick={() =>
                                openNotify(notification.id, notification.open)
                            }
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${notification.id}bh-content`}
                                id={notification.id}
                                style={{
                                    backgroundColor: !notification.open
                                        ? '#efeeee'
                                        : 'white',
                                }}
                            >
                                {!notification.open && (
                                    <RiCheckboxBlankCircleFill
                                        color="#229fea"
                                        style={{
                                            marginTop: '2px',
                                            marginRight: '6px',
                                        }}
                                    />
                                )}
                                <Typography className={classes2.heading}>
                                    <Link
                                        onClick={() => handleClose()}
                                        to={
                                            notification.exam_id
                                                ? '/user/exams'
                                                : notification.type ===
                                                  'request'
                                                ? '/admin/requests'
                                                : '#'
                                        }
                                    >
                                        {notification.name}
                                    </Link>
                                </Typography>
                                <Typography
                                    className={classes.secondaryHeading}
                                    style={{ color: '#a5a5a5' }}
                                >
                                    <ReactTimeAgo
                                        date={new Date(notification.date)}
                                        locale="en-US"
                                        timeStyle="facebook"
                                    />
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {notification.description}
                                    {notification.type === 'login'
                                        ? ' 👋'
                                        : notification.type === 'request'
                                        ? ' 🙋‍♂️'
                                        : ' 😎'}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </Popover>
        </div>
    );
}
