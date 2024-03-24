import React, { useState, useEffect } from 'react';
import MotionHoc from './MotionHoc';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { toast } from 'react-toastify';

import { loadLinks, addLink, updateLink, deleteLink } from '../../store/zoom';
import ZoLink from '../../components/admin/zoomLink';
import VerticalModal from '../../components/admin/verticalModel';
import AddLinkForm from '../../components/admin/addLinkForm';
import UpdateLinkForm from '../../components/admin/updateLinkForm';
import DeleteLinkForm from '../../components/admin/deleteLinkForm';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

function ZoomLinkComponent(props) {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    const [classCourseId, setClassCourseId] = useState('');
    const [classCourseName, setClassCourseName] = useState('');
    const [addFormShow, setAddFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [linkId, setLinkId] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');

    const links = useSelector((state) => state.entities.zoom.list);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setClassCourseId(location.state.classCourseId);
        setClassCourseName(location.state.classCourseName);
        dispatch(loadLinks(location.state.classCourseId));

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('zoomLink', (payload) => {
            dispatch(loadLinks(location.state.classCourseId));
        });

        return () => socket.disconnect();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const addLinkClicked = () => {
        setFormTitle('New Zoom Link');
        setModalShow(true);
        setAddFormShow(true);
        setUpdateFormShow(false);
        setDeleteFormShow(false);
    };

    const updateLinkClicked = (id) => {
        setLinkId(id);
        setFormTitle('Update Zoom Link');
        setModalShow(true);
        setUpdateFormShow(true);
        setAddFormShow(false);
        setDeleteFormShow(false);
    };

    const deleteLinkClicked = (id) => {
        setLinkId(id);
        setFormTitle('Delete Zoom Link');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setAddFormShow(false);
    };

    const handleAddSubmitted = async (newLink) => {
        setModalShow(false);
        dispatch(addLink(newLink, classCourseId));
        toast.success('Link added successfully');
    };

    const handleUpdatedSubmitted = (updatedLink) => {
        setModalShow(false);
        dispatch(updateLink(linkId, updatedLink));
        toast.success('Link updated successfully');
    };

    const handleDeleteSubmitted = () => {
        setModalShow(false);
        dispatch(deleteLink(linkId));
        toast.success('Link deleted successfully');
    };

    const displayLinks = links.map((link) => (
        <div key={link.id} className="zoom-container">
            <ZoLink
                id={link.id}
                classCourseName={classCourseName}
                subject={link.subject}
                date={link.date}
                link={link.link}
                updateClicked={updateLinkClicked}
                deleteClicked={deleteLinkClicked}
            />
        </div>
    ));
    return (
        <div className="zoom-page">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {addFormShow && <AddLinkForm submitted={handleAddSubmitted} />}
                {updateFormShow && (
                    <UpdateLinkForm
                        id={linkId}
                        submitted={handleUpdatedSubmitted}
                    />
                )}

                {deleteFormShow && (
                    <DeleteLinkForm
                        id={linkId}
                        submitted={handleDeleteSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="courses-header">
                <h3>
                    <GoDeviceCameraVideo
                        size={'1.7rem'}
                        color="#803bec"
                        style={{
                            marginRight: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    Zoom Links
                </h3>
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={`${classes.button} add-btn`}
                        startIcon={<AddCircleSharpIcon />}
                        onClick={addLinkClicked}
                    >
                        Add Zoom Link
                    </Button>
                </div>
            </div>
            <div className="zoom-section">{displayLinks}</div>
        </div>
    );
}

const ZoomLink = MotionHoc(ZoomLinkComponent);

export default ZoomLink;
