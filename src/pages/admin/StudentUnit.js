import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { toast } from "react-toastify";
import MotionHoc from "./MotionHoc";
import { IoPeople } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import VerticalModal from "../../components/admin/verticalModel";
import StudentsUnitTable from "../../components/admin/studentsUnitTable";
import {
    loadSpecificUsersUnit,
    loadAssignedUsersUnit,
    addUserToUnit,
    deleteUserFromUnit,
} from "../../store/usersUnit";
import * as studentUnitService from "../../services/studentUnitService";
import AddStudentToUnitForm from "../../components/admin/AddStudentToUnitForm";
import DeleteUserFromUnitForm from "../../components/admin/DeleteUserFromUnitForm";

let backendURL = process.env.REACT_APP_API_URL;
let socket;

function StudentUnitComponent(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [results, setResults] = useState([]);
    const [email, setEmail] = useState("");
    const [unitId, setUnitId] = useState();
    const [unitName, setUnitName] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [progress, setProgress] = useState(0);
    const [addFormShow, setAddFormShow] = useState(false);
    const [deleteFormShow, setDeleteFormShow] = useState(false);
    const [studentEmail, setStudentEmail] = useState(false);
    const [studentId, setStudentId] = useState(false);
    const [studentName, setStudentName] = useState(false);
    const [student, setStudent] = useState(null);

    const ref = useRef(null);

    const studentsUnit = useSelector((state) => state.entities.usersUnit);
    const pagination = studentsUnit.pagination;

    useEffect(() => {
        socket = socketIOClient(backendURL);
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        const { unitId: id, unitName: name } = location.state;
        dispatch(loadSpecificUsersUnit(0, pagination.limit, id));
        setUnitId(id);
        setUnitName(name);
    }, [dispatch]);

    const fetchData = async (value) => {
        try {
            const { data } = await studentUnitService.getNotAssignedStudentsUnit(0, 10, unitId, value);
            setResults(data);
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleChange = (value) => {
        setEmail(value);
        fetchData(value);
    };

    const handleChangeEmailFilter = (value) => {
        setEmailFilter(value);
        dispatch(loadAssignedUsersUnit(0, pagination.limit, unitId, value));
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setResults([]);
            setEmail("");
        }
    };

    const cancelUploading = () => {
        setProgress(0);
        setModalShow(false);
    };

    const deleteClicked = (user) => {
        setFormTitle(`(${unitName}) :حذف طالب من الوحدة`);
        setModalShow(true);
        setDeleteFormShow(true);
        setAddFormShow(false);
        setStudentEmail(user.email);
        setStudentId(user.id);
        setStudent(user);
    };

    const addStudentToUnitClicked = ({ id, email, name }) => {
        setFormTitle(`(${unitName}) :اضافة طالب الى الوحدة`);
        setModalShow(true);
        setAddFormShow(true);
        setDeleteFormShow(false);
        setStudentEmail(email);
        setStudentId(id);
        setStudentName(name);
    };

    const unassiagnUserFromUnit = async () => {
        setModalShow(false);
        try {
            await dispatch(deleteUserFromUnit(studentId, unitId));
            toast.success("تم حذف هذا الطالب من هذه الوحدة بنجاح");
            dispatch(loadSpecificUsersUnit(0, pagination.limit, unitId));

            const receiver = { id: studentId };
            socket.emit(
                "unassignStudentFromUnit",
                { receiver, unitId },
                (error) => {}
            );
        } catch (error) {
            console.log(error);
        }
    };

    const addStudentToUnit = async (paymentAmount) => {
        setModalShow(false);
        try {
            await dispatch(addUserToUnit(studentId, unitId, paymentAmount));
            setResults([]);
            setEmail("");
            toast.success("تم اضافة الطالب لهذه الوحدة بنجاح");
            dispatch(loadSpecificUsersUnit(0, pagination.limit, unitId));

            const receiver = { id: studentId };
            socket.emit(
                "assignStudentToUnit",
                { receiver, unitId },
                (error) => {}
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePage = (event, newPage) => {
        dispatch(loadSpecificUsersUnit(newPage, pagination.limit, unitId))
    };

    return (
        <div className="student-unit">
            <VerticalModal
                formTitle={formTitle}
                progress={progress}
                show={modalShow}
                onHide={() => {
                    cancelUploading();
                }}
            >
                {addFormShow && (
                    <AddStudentToUnitForm
                        studentId={studentId}
                        studentEmail={studentEmail}
                        studentName={studentName}
                        submitted={addStudentToUnit}
                    />
                )}
                {deleteFormShow && (
                    <DeleteUserFromUnitForm
                        student={student}
                        submitted={unassiagnUserFromUnit}
                    />
                )}
            </VerticalModal>
            <div className="student-unit-header">
                <h3 style={{fontSize : '25px'}}>
                    <IoPeople
                        size={"3rem"}
                        color="#803bec"
                        style={{
                            marginRight: "10px",
                            marginBottom: "5px",
                        }}
                    />
                    ( {unitName} )طلاب الوحدة
                </h3>
            </div>
            <div className="search-bar-container" ref={ref}>
                <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                        className="student-unit-email-serach-input"
                        placeholder="Type student email to add..."
                        value={email}
                        onChange={(e) => handleChange(e.target.value)}
                        autoComplete="new-password"
                    />
                </div>
                <div className="results-list">
                    {results &&
                        results.length > 0 &&
                        results.map((result, id) => {
                            return (
                                <div
                                    key={id}
                                    className="search-result"
                                    onClick={(e) =>
                                        addStudentToUnitClicked(result)
                                    }
                                >
                                    {result.email}
                                </div>
                            );
                        })}
                </div>
            </div>
            <div
                className="search-bar-container"
                style={{ marginBottom: "10px" }}
            >
                <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                        className="student-unit-email-serach-input"
                        placeholder="Type student email to search in table..."
                        value={emailFilter}
                        onChange={(e) =>
                            handleChangeEmailFilter(e.target.value)
                        }
                    />
                </div>
            </div>
            <StudentsUnitTable
                studentsUnit={studentsUnit.list}
                pagination={pagination}
                loading={studentsUnit.loading}
                deleteClicked={deleteClicked}
                handleChangePage={handleChangePage}
            />
            <div style={{ width: "100%", height: "200px" }}></div>
        </div>
    );
}

const StudentUnit = MotionHoc(StudentUnitComponent);

export default StudentUnit;
