import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

import Table from '../../components/admin/table';
import VerticalModal from '../../components/admin/verticalModel.jsx';
import RequestDeleteForm from '../../components/admin/requestDeleteForm';
import RequestAcceptForm from '../../components/admin/requestAcceptForm';

import {
    loadRequests,
    deleteRequest,
    acceptRequest,
} from '../../store/requests';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const RequestsComponent = () => {
    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [requestId, setRequestId] = useState('');
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);

    const userRequests = useSelector((state) => state.requests.list);

    useEffect(() => {
        dispatch(loadRequests());
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('requests', (payload) => {
            dispatch(loadRequests());
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle('Delete Request');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setRequestId(id);
    };

    const acceptClicked = (id) => {
        setFormTitle('Accept Request');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setRequestId(id);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(deleteRequest(requestId));
            toast.success('Request deleted successfully');
        } catch (err) {
            console.log(err.response);
        }
    };
    const handleAcceptSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(acceptRequest(requestId));

            toast.success('Request accepted successfully');
            socket = socketIOClient(backendURL);
            socket.emit(
                'acceptTeacher',
                { payload: 'Accepted' },
                (error) => {}
            );
        } catch (err) {
            console.log(err.response);
        }
    };

    return (
        <div className="requests-page">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {deleteFormShow && (
                    <RequestDeleteForm
                        id={requestId}
                        submitted={handleDeleteSubmitted}
                    />
                )}

                {updateFormShow && (
                    <RequestAcceptForm
                        id={requestId}
                        submitted={handleAcceptSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="requests-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={'1.7rem'}
                        color="#803bec"
                        style={{
                            marginRight: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    Requests
                </h3>
            </div>
            <Table
                userRequests={userRequests}
                deleteClicked={deleteClicked}
                acceptClicked={acceptClicked}
            />
        </div>
    );
};

const Requests = MotionHoc(RequestsComponent);

export default Requests;
