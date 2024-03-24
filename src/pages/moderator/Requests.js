import React, { useEffect, useState } from 'react';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

import http from '../../services/httpService';
import Table from '../../components/table.jsx';
import VerticalModal from '../../components/admin/verticalModel.jsx';
import RequestDeleteForm from '../../components/admin/requestDeleteForm';
import RequestAcceptForm from '../../components/admin/requestAcceptForm';

let backendURL = process.env.REACT_APP_API_URL;

const RequestsComponent = () => {
    const [modalShow, setModalShow] = useState(false);
    const [userRequests, setUserRequests] = useState([]);
    const [formTitle, setFormTitle] = useState('');
    const [requestId, setRequestId] = useState('');
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await http.get(`${backendURL}/api/userRequest`);
        setUserRequests(data);
    };

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
            await http.delete(`${backendURL}/api/userRequest/${requestId}`);
            const newUserRequests = userRequests.filter(
                (c) => c._id !== requestId
            );
            setUserRequests(newUserRequests);
            toast.success('Request deleted successfully');
        } catch (err) {
            console.log(err.response);
        }
    };
    const handleAcceptSubmitted = async () => {
        setModalShow(false);
        try {
            await http.put(`${backendURL}/api/userRequest/${requestId}`);
            const newUserRequests = userRequests.filter(
                (c) => c._id !== requestId
            );
            setUserRequests(newUserRequests);
            toast.success('Request accepted successfully');
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
