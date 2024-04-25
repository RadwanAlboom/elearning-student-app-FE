import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import MotionHoc from "./MotionHoc";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { toast } from "react-toastify";
import SearchDropDown from "../../components/seacrhDropDown.jsx";
import Input from "../../components/input.jsx";

import TeacherTable from "../../components/admin/teacherTable.jsx";
import VerticalModal from "../../components/admin/verticalModel.jsx";
import TableDeleteForm from "../../components/admin/TableDeleteForm";

import {
    loadTeachers,
    deleteTeacher,
    updateTeacher,
    updateTeacherBlockStatus
} from "../../store/instructor";
import UserUpdateForm from "../../components/admin/userUpdateForm";
import BlockStatusForm from "../../components/admin/BlockStatusForm.jsx";

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const TeahersComponent = () => {
    const dispatch = useDispatch();

    const [block, setBlock] = useState(false);
    const [updateBlockStatusFormShow, setUpdateBlockStatusFormShow] =
        useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailFilter, setEmailFilter] = useState("");

    const teachers = useSelector((state) => state.teachers.list);

    useEffect(() => {
        dispatch(loadTeachers(emailFilter));
    }, [dispatch]);

    const deleteClicked = (id) => {
        setFormTitle("حذف معلم");
        setModalShow(true);
        setDeleteFormShow(true);
        setUpdateFormShow(false);
        setUpdateBlockStatusFormShow(false);
        setTeacherId(id);
    };

    const updateClicked = (id) => {
        setFormTitle("تحديث معلومات المعلم");
        setModalShow(true);
        setUpdateFormShow(true);
        setDeleteFormShow(false);
        setUpdateBlockStatusFormShow(false);
        setTeacherId(id);
    };

    const updateTeacherBlockStatusClicked = (id, isBlock) => {
        setFormTitle(isBlock ? "حظر معلم" : "الغاء حظر المعلم");
        setModalShow(true);
        setUpdateBlockStatusFormShow(true);
        setUpdateFormShow(false);
        setDeleteFormShow(false);
        setTeacherId(id);
        setBlock(isBlock);
    };

    const handleDeleteSubmitted = async () => {
        setModalShow(false);
        try {
            dispatch(deleteTeacher(teacherId));
            toast.success("تم حذف المعلم بنجاح");

            socket = socketIOClient(backendURL);
            socket.emit("teachers", { id: teacherId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };
    const handleUpdateSubmitted = async (updatedStudent) => {
        setModalShow(false);
        try {
            dispatch(updateTeacher(teacherId, updatedStudent));
            toast.success("تم تحديث معلومات المعلم بنجاح");
            socket = socketIOClient(backendURL);
            socket.emit("teachers", { id: teacherId }, (error) => {});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleBlockStatusChange = async () => {
        setModalShow(false);
        try {
            dispatch(updateTeacherBlockStatus(teacherId, block));
            toast.success(block ? "تم حظر المعلم بنجاح" : "تم الغاء الحظر عن المعلم بنجاح");
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
                        id={teacherId}
                        submitted={handleDeleteSubmitted}
                        popup="هل انت متأكد من انك تريد حذف هذا المعلم؟"
                        btnName="حذف معلم"
                    />
                )}

                {updateFormShow && (
                    <UserUpdateForm
                        id={teacherId}
                        submitted={handleUpdateSubmitted}
                    />
                )}

                {updateBlockStatusFormShow && (
                    <BlockStatusForm
                        id={teacherId}
                        submitted={handleBlockStatusChange}
                        popup={
                            block
                                ? "هل انت متأكد انك تريد حظر هذا المعلم"
                                : "هل انت متأكد انك تريد الغاء الحظر عن هذا المعلم"
                        }
                        btnName={block ? "حظر" : "الغاء الحظر"}
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
                    المعلمين
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
                            onClick={() => dispatch(loadTeachers(emailFilter))}
                        >
                            Search
                        </button>
                        <button
                            style={{ marginBottom: "10px", marginLeft: "10px" }}
                            className="btn btn-primary"
                            onClick={() => {
                                setEmailFilter("");
                                dispatch(loadTeachers(""));
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
            <TeacherTable
                teachers={teachers}
                deleteClicked={deleteClicked}
                acceptClicked={updateClicked}
                btnName="Update"
                updateTeacherBlockStatusClicked={updateTeacherBlockStatusClicked}
            />
            <div style={{ width: "100%", height: "200px" }}></div>
        </div>
    );
};

const Teachers = MotionHoc(TeahersComponent);

export default Teachers;
