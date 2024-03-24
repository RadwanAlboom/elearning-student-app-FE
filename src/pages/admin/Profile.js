import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MotionHoc from './MotionHoc';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import { FaUserTie } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { AiOutlineCamera } from 'react-icons/ai';
import { toast } from 'react-toastify';

import {
    loadProfile,
    updateImageProfile,
    updatePassProfile,
} from '../../store/profile';
import auth from '../../services/authService';
import VerticalModal from '../../components/admin/verticalModel';
import ImgUpdateForm from '../../components/imgUpdateForm';
import '../moderator/profile.css';

import userImg from '../../assets/user.jpg';
import PassUpdateForm from '../../components/passUpdateForm';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

const ProfileComponent = () => {
    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [id, setId] = useState('');
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [updatePassFormShow, setPassUpdateFormShow] = useState(false);
    const profile = useSelector((state) => state.profile.list);

    const dispatch = useDispatch();
    useEffect(() => {
        if (auth.getCurrentUser()) {
            dispatch(loadProfile(auth.getCurrentUser().id));
        }
    }, [dispatch]);

    const updateClicked = (id) => {
        setFormTitle('Update Profile Image');
        setModalShow(true);
        setUpdateFormShow(true);
        setPassUpdateFormShow(false);
        setId(id);
    };

    const updatePassClicked = (id) => {
        setFormTitle('Change Password');
        setModalShow(true);
        setPassUpdateFormShow(true);
        setUpdateFormShow(false);
        setId(id);
    };

    const handleUpdateSubmitted = (newImg) => {
        setModalShow(false);
        dispatch(updateImageProfile(id, newImg));

        toast.success('Course updated successfully');
    };

    const handlePassUpdateSubmitted = (updatedPass) => {
        setModalShow(false);
        dispatch(updatePassProfile(id, updatedPass));
        toast.success('Password updated successfully');
    };
    return (
        <div style={{ height: '95vh', width: '100%', overflowY: 'auto' }}>
            <div className="profile-container">
                <VerticalModal
                    formTitle={formTitle}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                >
                    {updateFormShow && (
                        <ImgUpdateForm
                            id={id}
                            btnName={'Update Profile Image'}
                            submitted={handleUpdateSubmitted}
                        />
                    )}
                    {updatePassFormShow && (
                        <PassUpdateForm
                            id={id}
                            btnName={'Update Password'}
                            submitted={handlePassUpdateSubmitted}
                        />
                    )}
                </VerticalModal>
                <div className="profile-subcontainer">
                    <div className="top-left-triangle"></div>
                    <div className="bottom-left-triangle"></div>
                    <div className="top-right-triangle"></div>
                    <div className="bottom-right-triangle"></div>
                    <IconButton onClick={() => updateClicked(profile.id)}>
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
                            <div className="circle-top">
                                <AiOutlineCamera
                                    className="camera-icon"
                                    color="white"
                                    size="40px"
                                />
                            </div>
                        </div>
                    </IconButton>
                    <div className="info-control-container">
                        <div className="control-container">
                            <div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={`${classes.button} add-btn`}
                                    startIcon={<CreateIcon />}
                                    onClick={() =>
                                        updatePassClicked(profile.id)
                                    }
                                >
                                    Change Password
                                </Button>
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
                                    Admin Name: {profile.name}
                                </div>
                                <div>
                                    <IoMail style={{ marginRight: '10px' }} />
                                    Email: {profile.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Profile = MotionHoc(ProfileComponent);

export default Profile;
