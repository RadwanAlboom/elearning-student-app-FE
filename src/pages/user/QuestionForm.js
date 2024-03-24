import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MotionHoc from './MotionHoc';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';

import http from '../../services/httpService';
import auth from '../../services/authService';
import QuestionUI from '../../components/user/questionUI';
import * as examService from '../../services/examService';
import { addNotification } from '../../store/userNotifications';
import '../admin/QuestionForm.css';

let backendURL = process.env.REACT_APP_API_URL;

function QuestionFormComponent() {
    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

    const [questions, setQuestions] = useState([]);
    const [documentName, setDocName] = useState('untitled Document');
    const [documentDescription, setDocDesc] = useState('Add Description');
    const [successRate, setSuccessRate] = useState(0);
    const [examId, setExamId] = useState('');
    const [classId, setClassCourseId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [user, setUser] = useState({});

    const fetchExam = useCallback(async () => {
        setUser(auth.getCurrentUser());
        if (!location.state) {
            history.goBack();
        }
        const { state } = location;
        const { id } = state;
        try {
            const { data: exam } = await http.get(
                `${backendURL}/api/form/exams/${id}/user/${user.id}`
            );
            setDocName(exam.name);
            setDocDesc(exam.description);
            setQuestions(exam.questions);
            setSuccessRate(exam.successRate);
            setExamId(id);
            setClassCourseId(location.state.classCourseId);
            setTeacherId(location.state.teacherId);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.info(
                    'You already pass the exam, see details on your exams page'
                );
                history.push('/user/exams');
            }
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, history]);

    useEffect(() => {
        fetchExam();
        return () => {
            setQuestions([]);
            setSuccessRate(0);
            setDocName('');
            setDocDesc('');
            setExamId('');
            setClassCourseId('');
            setTeacherId('');
            setUser({});
        };
    }, [user.id, history, fetchExam]);

    function setOptionAnswer(ans, qno) {
        var Questions = [...questions];
        Questions[qno].answerKey = ans;
        setQuestions(Questions);
    }

    const saveClicked = async () => {
        let currentUser = auth.getCurrentUser();
        const API_URL = `/users/${currentUser.id}/classCourses/${classId}/exams/${examId}/submit`;
        try {
            const { data } = await examService.submitForm(
                documentName,
                documentDescription,
                questions,
                teacherId,
                auth.getCurrentUser().name,
                API_URL
            );
            dispatch(addNotification(data[0]));
            toast.success('Exam submitted successfully');
            history.push('/user/exams');
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div
            style={{
                height: '700px',
                overflowY: 'auto',
            }}
        >
            <div className="question_form">
                <br></br>
                <div className="section">
                    <div className="question_title_section">
                        <div className="question_form_top">
                            <input
                                type="text"
                                readOnly
                                className="question_form_top_name"
                                style={{ color: 'black' }}
                                placeholder="Document Title"
                                value={documentName}
                            ></input>
                            <input
                                type="text"
                                readOnly
                                className="question_form_top_desc"
                                placeholder="Form Description"
                                value={documentDescription}
                            ></input>
                            <div
                                style={{
                                    marginTop: '10px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                Success Rate:
                                <input
                                    type="number"
                                    className="rate"
                                    value={successRate}
                                    disabled
                                />
                                %
                            </div>
                        </div>
                    </div>

                    <div>
                        {questions && (
                            <QuestionUI
                                questions={questions}
                                setOptionAnswer={setOptionAnswer}
                            />
                        )}
                    </div>

                    <div className="save_form">
                        {!user.isAdmin && !user.isModerator && (
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ fontSize: '14px' }}
                                onClick={saveClicked}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuestionForm = MotionHoc(QuestionFormComponent);

export default QuestionForm;
