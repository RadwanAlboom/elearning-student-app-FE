import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { toast } from 'react-toastify';
import MotionHoc from "./MotionHoc";
import { IoPeople } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import StudentsUnitTable from "../../components/admin/studentsUnitTable";
import {loadSpecificUsersUnit, loadAssignedUsersUnit, addUserToUnit, deleteUserFromUnit} from '../../store/usersUnit';
import * as studentUnitService from '../../services/studentUnitService';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

function StudentUnitComponent(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [results, setResults] = useState([]);
    const [email, setEmail] = useState("");
    const [unitId, setUnitId] = useState();
    const [unitName, setUnitName] = useState('');
    const [emailFilter, setEmailFilter] = useState("");
    
    const ref = useRef(null);

    const studentsUnit = useSelector((state) => state.entities.usersUnit.list);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        const { unitId: id, unitName: name } = location.state; 
        dispatch(loadSpecificUsersUnit(id));
        setUnitId(id);
        setUnitName(name);
    }, [dispatch]);

    const fetchData = async (value) => {
        try{
            const { data } = await studentUnitService.getNotAssignedStudentsUnit(unitId, value);
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
        dispatch(loadAssignedUsersUnit(unitId, value));
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

    const deleteClicked = (userId) => {
        try {
            dispatch(deleteUserFromUnit(userId, unitId));
            toast.success('تم حذف هذا الطالب بنجاح');

            const receiver = {id: userId};
            socket.emit(
                'unassignStudentFromUnit',
                { receiver, unitId },
                (error) => {}
            );
        } catch (error) {
            console.log(error);
        }
    }

    const addStudentToUnit = async (userId) => {
        try {
            dispatch(addUserToUnit(userId, unitId));
            setResults([]);
            setEmail("");
            toast.success('تم اضافة الطالب لهذه الوحدة بنجاح');

            const receiver = {id: userId};
            socket.emit(
                'assignStudentToUnit',
                { receiver, unitId },
                (error) => {}
            );
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="student-unit">
            <div className="student-unit-header">
                <h3>
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
                                    onClick={(e) => addStudentToUnit(result.id)}
                                >
                                    {result.email}
                                </div>
                            );
                        })}
                </div>
            </div>
            <div className="search-bar-container" style={{marginBottom: '10px'}}>
                <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                        className="student-unit-email-serach-input"
                        placeholder="Type student email to search in table..."
                        value={emailFilter}
                        onChange={(e) => handleChangeEmailFilter(e.target.value)}
                    />
                </div>
            </div>
            <StudentsUnitTable
                studentsUnit={studentsUnit}
                deleteClicked={deleteClicked}
            />
            <div style={{width: '100%', height: '200px'}}></div>
        </div>
    );
}

const StudentUnit = MotionHoc(StudentUnitComponent);

export default StudentUnit;
