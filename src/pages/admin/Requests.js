import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import SearchDropDown from '../../components/seacrhDropDown.jsx';
import Input from '../../components/input.jsx';

import RequestTable from '../../components/admin/requestTable.jsx';
import VerticalModal from '../../components/admin/verticalModel.jsx';
import TableDeleteForm from '../../components/admin/TableDeleteForm';
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
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailFilter, setEmailFilter] = useState('');

    const userRequests = useSelector((state) => state.requests);
    const pagination = userRequests.pagination;

    useEffect(() => {
        dispatch(loadRequests(0, pagination.limit, emailFilter));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('requests', (payload) => {
            dispatch(loadRequests(0, pagination.limit, ''));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle('حذف طلب');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setRequestId(id);
    };

    const acceptClicked = (id) => {
        setFormTitle('قبول طلب');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setRequestId(id);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            await dispatch(deleteRequest(requestId));
            toast.success('تم حذف الطلب بنجاح');
            dispatch(loadRequests(0, pagination.limit, emailFilter));
        } catch (err) {
            console.log(err.response);
        }
    };
    const handleAcceptSubmitted = async () => {
        setModalShow(false);
        try {
            await dispatch(acceptRequest(requestId));
            toast.success('تم قبول الطلب بنجاح');
            dispatch(loadRequests(0, pagination.limit, emailFilter));

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

    const handleChangeDropDown = (event) => {
        if (event.target.name === 'email') {
            setEmailChecked(event.target.checked);
        }
    };

    const handleChangePage = (event, newPage) => {
        dispatch(loadRequests(newPage, pagination.limit, emailFilter))
    };

    return (
        <div className="requests-page">
            <VerticalModal
                formTitle={formTitle}
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                {deleteFormShow && (
                    <TableDeleteForm
                        id={requestId}
                        submitted={handleDeleteSubmitted}
                        popup="هل انت متأكد من انك تريد حذف هذا الطلب؟"
                        btnName="حذف طلب"
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
                    الطلبات
                </h3>
            </div>
            <SearchDropDown 
                filters={['email']}
                handleChange={handleChangeDropDown}
                checked={emailChecked}
            />
            {emailChecked && <div className='search-input'>
                    <Input
                        name='email'
                        label='email:'
                        onChange={(e) => {setEmailFilter(e.target.value)}}
                        value={emailFilter}
                    />
                    <div>
                        <button
                            style={{marginBottom: '10px'}}
                            className="btn btn-primary"
                            onClick={() => dispatch(loadRequests(0, pagination.limit, emailFilter))}
                        >
                            Search
                        </button>
                        <button
                            style={{marginBottom: '10px', marginLeft: '10px'}}
                            className="btn btn-primary"
                            onClick={() => {
                                setEmailFilter('');
                                dispatch(loadRequests(0, pagination.limit, ''));
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            }
            <RequestTable
                userRequests={userRequests.list}
                pagination={pagination}
                loading={userRequests.loading}
                deleteClicked={deleteClicked}
                acceptClicked={acceptClicked}
                handleChangePage={handleChangePage}
            />
            <div style={{width: '100%', height: '200px'}}></div>
        </div>
    );
};

const Requests = MotionHoc(RequestsComponent);

export default Requests;
