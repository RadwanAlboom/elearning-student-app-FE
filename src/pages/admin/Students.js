import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import MotionHoc from "./MotionHoc";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { toast } from "react-toastify";

import UserTable from "../../components/admin/userTable.jsx";
import VerticalModal from "../../components/admin/verticalModel.jsx";
import TableDeleteForm from "../../components/admin/TableDeleteForm";
import SearchDropDown from "../../components/seacrhDropDown.jsx";
import Input from "../../components/input.jsx";
import { socketMsg } from '../../socket';

import {
    loadStudents,
    deleteStudent,
    updateStudent,
    updateStudentBlockStatus
} from "../../store/students";
import UserUpdateForm from "../../components/admin/userUpdateForm";
import BlockStatusForm from "../../components/admin/BlockStatusForm.jsx";

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const StudentsComponent = () => {
    const dispatch = useDispatch();

    const [block , setBlock] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [studentId, setStudentId] = useState("");
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [updateBlockStatusFormShow, setUpdateBlockStatusFormShow] =
        useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailFilter, setEmailFilter] = useState("");

    const students = useSelector((state) => state.students.list);

    useEffect(() => {
        dispatch(loadStudents(emailFilter));
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle("حذف طالب");
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setUpdateBlockStatusFormShow(false);
        setStudentId(id);
    };

    const updateClicked = (id) => {
        setFormTitle("تحديث معلومات الطالب");
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setUpdateBlockStatusFormShow(false);
        setStudentId(id);
    };

    const updateUserBlockStatusClicked = (id, isBlock) => {
        setFormTitle(isBlock ? "حظر طالب" : "الغاء حظر الطالب");
        setModalShow(true);
        setUpdateBlockStatusFormShow(true);
        setUpdateFormShow(false);
        setDeleteFormShow(false);
        setStudentId(id);
        setBlock(isBlock);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(deleteStudent(studentId));
            toast.success("تم حذف الطالب بنجاح");

            socket = socketIOClient(backendURL);
            socket.emit("students", { id: studentId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };
    const handleUpdateSubmitted = async (updatedStudent) => {
        setModalShow(false);
        try {
            dispatch(updateStudent(studentId, updatedStudent));
            toast.success("تم تحديث معلومات الطالب بنجاح");
            socket = socketIOClient(backendURL);
            socket.emit("students", { id: studentId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleBlockStatusChange = async () => {
        setModalShow(false);
        try {
            dispatch(updateStudentBlockStatus(studentId, block));
            toast.success(block ? "تم حظر الطالب بنجاح" : "تم الغاء الحظر عن الطالب بنجاح");

            if (block) {
                const receiver = {id : studentId}
                socketMsg.emit('blockUser', {receiver});
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChangeDropDown = (event) => {
        if (event.target.name === "email") {
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
                    <TableDeleteForm
                        id={studentId}
                        submitted={handleDeleteSubmitted}
                        popup="هل انت متأكد من انك تريد حذف هذا الطالب؟"
                        btnName="حذف طالب"
                    />
                )}

                {updateFormShow && (
                    <UserUpdateForm
                        id={studentId}
                        submitted={handleUpdateSubmitted}
                    />
                )}

                {updateBlockStatusFormShow && (
                    <BlockStatusForm
                        id={studentId}
                        submitted={handleBlockStatusChange}
                        popup={block ? 'هل انت متأكد انك تريد حظر هذا الطالب' : 'هل انت متأكد انك تريد الغاء الحظر عن هذا الطالب'}
                        btnName={block ? 'حظر' : 'الغاء الحظر'}
                    />
                )}
            </VerticalModal>
            <div className="requests-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={"1.7rem"}
                        color="#803bec"
                        style={{
                            marginRight: "10px",
                            marginBottom: "5px",
                        }}
                    />
                    الطلاب
                </h3>
            </div>
            <SearchDropDown
                filters={["email"]}
                handleChange={handleChangeDropDown}
                checked={emailChecked}
            />
            {emailChecked && (
                <div className="search-input">
                    <Input
                        name="email"
                        label="email:"
                        onChange={(e) => {
                            setEmailFilter(e.target.value);
                        }}
                        value={emailFilter}
                    />
                    <div>
                        <button
                            style={{ marginBottom: "10px" }}
                            className="btn btn-primary"
                            onClick={() => dispatch(loadStudents(emailFilter))}
                        >
                            Search
                        </button>
                        <button
                            style={{ marginBottom: "10px", marginLeft: "10px" }}
                            className="btn btn-primary"
                            onClick={() => {
                                setEmailFilter("");
                                dispatch(loadStudents(""));
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
            <UserTable
                students={students}
                deleteClicked={deleteClicked}
                acceptClicked={updateClicked}
                btnName="Update"
                updateUserBlockStatusClicked={updateUserBlockStatusClicked}
            />
            <div style={{ width: "100%", height: "200px" }}></div>
        </div>
    );
};

const Students = MotionHoc(StudentsComponent);

export default Students;
