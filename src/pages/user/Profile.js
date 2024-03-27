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

import userImg from '../../assets/user.png';
import PassUpdateForm from '../../components/passUpdateForm';
import {uploadProfileImage, handleDeleteFile} from "../../services/uploadService";

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
    const [imageId, setImageId] = useState('');
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [updatePassFormShow, setPassUpdateFormShow] = useState(false);
    const[progress, setProgress] = useState(0)
    const[clicked, setClicked] = useState(false);
    const profile = useSelector((state) => state.profile.list);

    const dispatch = useDispatch();
    useEffect(() => {
        if (auth.getCurrentUser()) {
            dispatch(loadProfile(auth.getCurrentUser().id));
        }
    }, [dispatch]);

    const updateClicked = (id, imageId) => {
        setFormTitle('تحديث صورة الملف الشخصي');
        setModalShow(true);
        setUpdateFormShow(true);
        setPassUpdateFormShow(false);
        setId(id);
        setImageId(imageId)
    };

    const updatePassClicked = (id) => {
        setFormTitle('تحديث كلمة المرور');
        setModalShow(true);
        setPassUpdateFormShow(true);
        setUpdateFormShow(false);
        setId(id);
    };

    const handleUpdateSubmitted = async ({imageId, newImg}) => {
        setClicked(true);

        try {
            const {data} = await uploadProfileImage(newImg, setProgress);
            dispatch(updateImageProfile(id, {url: data.secure_url, publicId: data.public_id}));
            handleDeleteFile(imageId);
            toast.success('تم تحديث صورة الملف الشخصي بنجاح');
        } catch(ex) {
            console.log(ex);
        }

        setModalShow(false);
        setProgress(0);
        setClicked(false);
    };

    const handlePassUpdateSubmitted = (updatedPass) => {
        setModalShow(false);
        dispatch(updatePassProfile(id, updatedPass));
        toast.success('تم تحديث كلمة المرور بنجاح');
    };
    return (
        <div style={{ height: '95vh', width: '100%', overflowY: 'auto' }}>
            <div className="profile-container">
                <VerticalModal
                    formTitle={formTitle}
                    progress={progress}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                >
                    {updateFormShow && (
                        <ImgUpdateForm
                            id={id}
                            imageId={imageId}
                            btnName={'تحديث صورة الملف الشخصي'}
                            submitted={handleUpdateSubmitted}
                            clicked={clicked}
                        />
                    )}
                    {updatePassFormShow && (
                        <PassUpdateForm
                            id={id}
                            btnName={'تحديث كلمة المرور'}
                            submitted={handlePassUpdateSubmitted}
                        />
                    )}
                </VerticalModal>
                <div className="profile-subcontainer">
                    <div className="top-left-triangle"></div>
                    <div className="bottom-left-triangle"></div>
                    <div className="top-right-triangle"></div>
                    <div className="bottom-right-triangle"></div>
                    <IconButton onClick={() => updateClicked(profile.id, profile.imageId)}>
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
                                    تحديث كلمة المرور
                                </Button>
                            </div>
                        </div>
                        <div className="info-container">
                            <div
                                className="profile-info"
                                style={{ width: '100%', fontSize: '20px' }}
                            >
                                <div>
                                    <FaUserTie
                                        style={{ marginRight: '10px' }}
                                    />
                                    Student Name: {profile.name}
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
