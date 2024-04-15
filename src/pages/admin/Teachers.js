import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import SearchDropDown from '../../components/seacrhDropDown.jsx';
import Input from '../../components/input.jsx';

import TeacherTable from '../../components/admin/teacherTable.jsx';
import VerticalModal from '../../components/admin/verticalModel.jsx';
import RequestDeleteForm from '../../components/admin/requestDeleteForm';

import {
    loadTeachers,
    deleteTeacher,
    updateTeacher,
} from '../../store/instructor';
import UserUpdateForm from '../../components/admin/userUpdateForm';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const TeahersComponent = () => {
    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [requestId, setRequestId] = useState('');
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailFilter, setEmailFilter] = useState('');

    const teachers = useSelector((state) => state.teachers.list);

    useEffect(() => {
        dispatch(loadTeachers(emailFilter));
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle('حذف معلم');
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setRequestId(id);
    };

    const updateClicked = (id) => {
        setFormTitle('تحديث معلومات المعلم');
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setRequestId(id);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(deleteTeacher(requestId));
            toast.success('تم حذف المعلم بنجاح');

            socket = socketIOClient(backendURL);
            socket.emit('teachers', { id: requestId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };
    const handleUpdateSubmitted = async (updatedStudent) => {
        setModalShow(false);
        try {
            dispatch(updateTeacher(requestId, updatedStudent));
            toast.success('تم تحديث معلومات المعلم بنجاح');
            socket = socketIOClient(backendURL);
            socket.emit('teachers', { id: requestId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChangeDropDown = (event) => {
        if (event.target.name === 'email') {
            setEmailChecked(event.target.checked);
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
                    المعلمين
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
                            onClick={() => dispatch(loadTeachers(emailFilter))}
                        >
                            Search
                        </button>
                        <button
                            style={{marginBottom: '10px', marginLeft: '10px'}}
                            className="btn btn-primary"
                            onClick={() => {
                                setEmailFilter('');
                                dispatch(loadTeachers(''));
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            }
            <TeacherTable
                userRequests={teachers}
                deleteClicked={deleteClicked}
                acceptClicked={updateClicked}
                btnName="Update"
            />
            <div style={{width: '100%', height: '200px'}}></div>
        </div>
    );
};

const Teachers = MotionHoc(TeahersComponent);

export default Teachers;
