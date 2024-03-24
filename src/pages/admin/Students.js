import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

import Table from '../../components/admin/table';
import VerticalModal from '../../components/admin/verticalModel.jsx';
import RequestDeleteForm from '../../components/admin/requestDeleteForm';

import {
    loadStudents,
    deleteStudent,
    updateStudent,
} from '../../store/students';
import UserUpdateForm from '../../components/admin/userUpdateForm';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const RequestsComponent = () => {
    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [requestId, setRequestId] = useState('');
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);

    const students = useSelector((state) => state.students.list);

    useEffect(() => {
        dispatch(loadStudents());
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle('Delete Student');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setRequestId(id);
    };

    const updateClicked = (id) => {
        setFormTitle('Update Student Info');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setRequestId(id);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(deleteStudent(requestId));
            toast.success('Student deleted successfully');

            socket = socketIOClient(backendURL);
            socket.emit('students', { id: requestId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };
    const handleUpdateSubmitted = async (updatedStudent) => {
        setModalShow(false);
        try {
            dispatch(updateStudent(requestId, updatedStudent));
            toast.success('Student Info updated successfully');
            socket = socketIOClient(backendURL);
            socket.emit('students', { id: requestId }, (error) => {});
        } catch (error) {
            console.log(error.response);
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
                    <UserUpdateForm
                        id={requestId}
                        submitted={handleUpdateSubmitted}
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
                    Students
                </h3>
            </div>
            <Table
                userRequests={students}
                deleteClicked={deleteClicked}
                acceptClicked={updateClicked}
                btnName="Update"
            />
        </div>
    );
};

const Requests = MotionHoc(RequestsComponent);

export default Requests;
