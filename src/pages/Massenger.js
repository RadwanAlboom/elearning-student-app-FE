import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './messenger.css';
import { IoMdClose } from 'react-icons/io';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import Message from '../components/message.jsx';
import auth from '../services/authService';
import http from '../services/httpService';
import { openNotification } from '../store/msgNotifications';
import { loadRecevierProfile } from '../store/profile';

import { loadMessages } from '../store/messages';
import { socketMsg } from '../socket';

let backendURL = process.env.REACT_APP_API_URL;

const Massenger = ({ handleCloseClick, teacherId: receiverId }) => {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState('');
    const messages = useSelector((state) => state.messages.list);
    const profileSender = useSelector((state) => state.profile.list);
    const profileRecevier = useSelector((state) => state.profile.recevier);
    const scrollRef = useRef(null);

    useEffect(() => {
        dispatch(loadRecevierProfile(receiverId));
    }, [dispatch, receiverId]);

    useEffect(() => {
        dispatch(loadMessages(auth.getCurrentUser().id, receiverId));
    }, [dispatch, receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
        });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const receiver = {
            senderId: auth.getCurrentUser().id,
            senderName: auth.getCurrentUser().name,
            receiverId,
            chatId: receiverId,
            email: auth.getCurrentUser().email,
            image: profileSender.image,
            name: profileRecevier.name,
            isModerator: auth.getCurrentUser().isModerator,
            text: newMessage,
        };

        const sender = {
            senderId: auth.getCurrentUser().id,
            senderName: auth.getCurrentUser().name,
            receiverId,
            chatId: receiverId,
            email: profileRecevier.email,
            image: profileRecevier.image,
            name: profileRecevier.name,
            text: newMessage,
        };

        socketMsg.emit('sendMessage', { sender, receiver });
        setNewMessage('');
    };

    const handleChatClick = async () => {
        dispatch(openNotification(receiverId));

        try {
            await http.put(
                `${backendURL}/api/messages/openMessage/${
                    auth.getCurrentUser().id
                }/${receiverId}`
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="chat-container" onClick={handleChatClick}>
            <div className="chat-header">
                <div>
                    <IconButton onClick={() => handleCloseClick()}>
                        <IoMdClose color="white" size="30px" />
                    </IconButton>
                </div>
                <div className="name-img">
                    <div style={{ fontSize: '18px', color: 'white' }}>
                        {profileRecevier.name}
                    </div>
                    <div className="profile-img">
                        <Avatar alt="Profile" src={profileRecevier.image} />
                    </div>
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    <>
                        <div className="chatBoxTop">
                            {messages.map((m) => {
                                return (
                                    <div key={m.id} ref={scrollRef}>
                                        <Message
                                            message={m.text}
                                            own={
                                                !(
                                                    m.sender_id + '' ===
                                                    auth.getCurrentUser().id +
                                                        ''
                                                )
                                            }
                                            senderImg={profileSender.image}
                                            recevierImg={profileRecevier.image}
                                            date={m.date}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea
                                className="chatMessageInput"
                                placeholder="write something..."
                                onChange={(e) => setNewMessage(e.target.value)}
                                value={newMessage}
                            ></textarea>
                            <button
                                className="chatSubmitButton"
                                onClick={handleSubmit}
                            >
                                Send
                            </button>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
};

export default Massenger;
