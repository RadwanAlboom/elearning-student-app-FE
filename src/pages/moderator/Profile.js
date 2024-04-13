import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MotionHoc from './MotionHoc';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import { FaUserTie } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { BsXDiamondFill } from 'react-icons/bs';
import { AiOutlineCamera } from 'react-icons/ai';
import { toast } from 'react-toastify';

import {
    loadProfile,
    updateImageProfile,
    updatePassProfile,
    updateWhatsProfile
} from '../../store/profile';
import auth from '../../services/authService';
import VerticalModal from '../../components/admin/verticalModel';
import ImgUpdateForm from '../../components/imgUpdateForm';
import './profile.css';

import userImg from '../../assets/user.jpg';
import PassUpdateForm from '../../components/passUpdateForm';
import {uploadImage, handleDeleteFile} from "../../services/uploadService";
import WhatsUpdateForm from './../../components/whatsUpdateForm';
import whatsapp from '../../assets/admin/whatsapp-purple.svg';

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
    const [updateWhatsFormShow, setWhatsUpdateFormShow] = useState(false);
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
        setImageId(imageId);
    };

    const updatePassClicked = (id) => {
        setFormTitle('تحديث كلمة المرور');
        setModalShow(true);
        setPassUpdateFormShow(true);
        setUpdateFormShow(false);
        setId(id);
    };

    const updateWhatsClicked = (id) => {
        setFormTitle('تحديث رابط الواتساب');
        setModalShow(true);
        setWhatsUpdateFormShow(true);
        setPassUpdateFormShow(false);
        setUpdateFormShow(false);
        setId(id);
    };

    const handleUpdateSubmitted = async ({imageId, newImg}) => {
        setClicked(true);

        try {
            const {data} = await uploadImage(newImg, setProgress);
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

    const handleWhatsUpdateSubmitted = (updatedWhats) => {
        setModalShow(false);
        dispatch(updateWhatsProfile(id, updatedWhats));
        toast.success('تم تحديث رابط الواتساب بنجاح');
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
                    {updateWhatsFormShow && (
                        <WhatsUpdateForm
                            id={id}
                            btnName={'تحديث رابط الواتساب'}
                            submitted={handleWhatsUpdateSubmitted}
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
                    <div className='teacher-profile-whatsapp'>
                        {profile.whatsapp && <a href={profile.whatsapp} target='_blank'  rel="noreferrer">
                            <img alt="" src={whatsapp} height="50" />
                        </a>}
                    </div>
                    <div className="info-control-container">
                        <div className="control-container">
                            <div style={{display: 'flex'}}>
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
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={`${classes.button} add-btn`}
                                    startIcon={<CreateIcon />}
                                    onClick={() =>
                                        updateWhatsClicked(profile.id)
                                    }
                                >
                                    تحديث الواتساب
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
            </div>
        </div>
    );
};

const Profile = MotionHoc(ProfileComponent);

export default Profile;
