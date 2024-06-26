import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';

import { loadChats, addChat } from '../../store/chatCord';
import { socketMsg } from '../../socket';
import auth from '../../services/authService';
import './chatRoom.css';

function ChatRoomComponent(props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [classCourseName, setClassCourseName] = useState('');
    const [classCourseId, setClassCourseId] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);

    const chats = useSelector((state) => state.chats.list);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setClassCourseId(location.state.classCourseId);
        dispatch(loadChats(location.state.classCourseId));
        setClassCourseName(location.state.classCourseName);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    useEffect(() => {
        socketMsg.emit('joinRoom', {
            id: auth.getCurrentUser().id,
            username: auth.getCurrentUser().name,
            room: location.state.classCourseId,
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socketMsg.on('message', (data) => {
            dispatch(addChat(data));
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socketMsg.on('roomUsers', (data) => {
            setUsers(data.users);
        });

        return () => {
            setUsers([]);
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        socketMsg.emit('chatMessage', {
            room: location.state.classCourseId,
            username: auth.getCurrentUser().name,
            msg: newMessage,
        });

        setNewMessage('');
    };

    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          handleSubmit(e);
        }
    }

    const handleLeave = () => {
        socketMsg.emit('leaveChat', {
            id: auth.getCurrentUser().id,
            username: auth.getCurrentUser().name,
            room: location.state.classCourseId,
        });
    };
    return (
        <div
            style={{
                height: '95vh',
                width: '100%',
                overflowY: 'auto',
                padding: '10px',
            }}
            className='chat-room'
        >
            <div className="chat-contain">
                <header className="chat-head">
                    <h1>
                        <i className="fas fa-smile"></i> ChatCord
                    </h1>
                    <Link to="/" className="chat-btn" onClick={handleLeave}>
                        Leave Room
                    </Link>
                </header>
                <main className="chat-main">
                    <div className="chat-sidebar">
                        <h4>
                            <i className="fas fa-comments"></i> Room Name:
                        </h4>
                        <h2 id="room-name">{classCourseName}</h2>
                        <h4>
                            <i className="fas fa-users"></i> Users
                        </h4>
                        <ul id="users">
                            {users.map((user, index) => {
                                return user.room + '' === classCourseId + '' ? (
                                    <li key={index}>{user.username}</li>
                                ) : (
                                    ''
                                );
                            })}
                        </ul>
                    </div>
                    <div className="chat-messages">
                        {chats.map((chat, index) => {
                            return chat.classcourse_id + '' ===
                                classCourseId + '' ? (
                                <div className="message" key={index}>
                                    <p className="meta">
                                        {chat.name}{' '}
                                        <span>
                                            <ReactTimeAgo
                                                date={new Date(chat.date)}
                                                locale="en-US"
                                                timeStyle="facebook"
                                            />
                                        </span>
                                    </p>
                                    <p className="text">{chat.text}</p>
                                </div>
                            ) : (
                                ''
                            );
                        })}
                    </div>
                </main>
                <div className="chat-form-container">
                    <div className="content" id="chat-form">
                         <textarea
                            placeholder="...اكتب رسالة"
                            className="form-control"
                            id='text'
                            rows="3"
                            name='text'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={onEnterPress}
                        ></textarea>
                    </div>
                    <div style={{textAlign: 'end', marginTop: '10px'}}>
                        <button className="chat-btn" onClick={handleSubmit}>
                            <i className="fas fa-paper-plane"></i> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ChatRoom = MotionHoc(ChatRoomComponent);
export default ChatRoom;
