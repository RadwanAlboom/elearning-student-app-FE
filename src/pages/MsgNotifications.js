import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { FaFacebookMessenger } from 'react-icons/fa';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';

import auth from '../services/authService';
import http from '../services/httpService';
import Messanger from '../pages/Massenger';
import {
    loadMsgNotifications,
    openNotification,
} from '../store/msgNotifications';

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

let backendURL = process.env.REACT_APP_API_URL;

export default function SimplePopover({ handleClose, anchorEl }) {
    const dispatch = useDispatch();
    const [showMessanger, setShowMessanger] = useState(false);
    const [recevierId, setRecevierId] = useState('');
    const classes = useStyles();
    const classes2 = useStyles2();

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const msgNotifications = useSelector(
        (state) => state.msgNotifications.list
    );

    useEffect(() => {
        if (auth.getCurrentUser()) {
            dispatch(loadMsgNotifications(auth.getCurrentUser().id));
        }
    }, [dispatch]);

    const handleCloseClick = () => {
        setShowMessanger(false);
    };

    const handleChatClick = async (chatId) => {
        dispatch(openNotification(chatId));

        try {
            await http.put(
                `${backendURL}/api/messages/openMessage/${
                    auth.getCurrentUser().id
                }/${chatId}`
            );
        } catch (error) {
            console.log(error);
        }
        setRecevierId(chatId);
        setShowMessanger(true);
        handleClose();
    };

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
                <div className={classes2.root}>
                    <div className="notify">
                        <FaFacebookMessenger
                            color="white"
                            style={{ marginRight: '5px', marginBottom: '5px' }}
                        />
                        Chats
                    </div>
                    <List>
                        {msgNotifications.map((msgNotify, index) => (
                            <div
                                key={msgNotify.id + '' + index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <ListItem
                                    button
                                    onClick={() =>
                                        handleChatClick(msgNotify.chatId)
                                    }
                                >
                                    {msgNotify.counter ? (
                                        <RiCheckboxBlankCircleFill
                                            color="#229fea"
                                            style={{
                                                marginTop: '2px',
                                                marginRight: '6px',
                                            }}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <ListItemIcon>
                                        <Avatar
                                            alt="Profile"
                                            src={msgNotify.image}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={msgNotify.name} />
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </div>
            </Popover>
            {auth.getCurrentUser() && showMessanger && (
                <Messanger
                    handleCloseClick={handleCloseClick}
                    teacherId={recevierId}
                />
            )}
        </div>
    );
}
