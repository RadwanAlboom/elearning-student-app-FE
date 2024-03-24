import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';
import IconButton from '@material-ui/core/IconButton';
import { FaUserTie } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { BsXDiamondFill } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import Messanger from '../Massenger';

import { loadTeacherProfile } from '../../store/profile';
import '../moderator/profile.css';
import userImg from '../../assets/user.jpg';

const ProfileComponent = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [showMessanger, setShowMessanger] = useState(false);
    const [teacherId, setTeacherId] = useState('');

    const profile = useSelector((state) => state.profile.teacher);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        dispatch(loadTeacherProfile(location.state.teacherId));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        setTeacherId(location.state.teacherId);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        setShowMessanger(!showMessanger);
    };

    const handleCloseClick = () => {
        setShowMessanger(false);
    };
    return (
        <div style={{ height: '95vh', width: '100%', overflowY: 'auto' }}>
            <div className="profile-container">
                <div className="profile-subcontainer">
                    <div className="top-left-triangle"></div>
                    <div className="bottom-left-triangle"></div>
                    <div className="top-right-triangle"></div>
                    <div className="bottom-right-triangle"></div>
                    <IconButton>
                        <div className="circle">
                            <img
                                src={profile.image ? profile.image : userImg}
                                alt="user"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </IconButton>
                    <div className="info-control-container">
                        <div className="control-container">
                            <div>
                                <IconButton onClick={handleClick}>
                                    <FaFacebookMessenger
                                        size="40px"
                                        color="#803bec"
                                    />
                                </IconButton>
                            </div>
                        </div>
                        <div className="info-container">
                            <div
                                style={{ width: '100%', fontSize: '20px' }}
                                className="profile-info"
                            >
                                <div>
                                    <FaUserTie
                                        style={{ marginRight: '10px' }}
                                    />
                                    Teacher Name: {profile.name}
                                </div>
                                <div>
                                    <IoMail style={{ marginRight: '10px' }} />
                                    Email: {profile.email}
                                </div>
                                <div>
                                    <BsXDiamondFill
                                        style={{ marginRight: '10px' }}
                                    />
                                    Major: {profile.major}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showMessanger && (
                    <Messanger
                        handleCloseClick={handleCloseClick}
                        teacherId={teacherId}
                    />
                )}
            </div>
        </div>
    );
};

const Profile = MotionHoc(ProfileComponent);

export default Profile;
