import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';

import ReviewQuestionUI from '../../components/user/reviewQuestionUI';
import http from '../../services/httpService';
import '../admin/QuestionForm.css';

let backendURL = process.env.REACT_APP_API_URL;

function QuestionFormComponent() {
    let location = useLocation();
    const history = useHistory();
    const [questions, setQuestions] = useState([]);
    const [documentName, setDocName] = useState('untitled Document');
    const [documentDescription, setDocDesc] = useState('Add Description');
    const [actualSuccessRate, setActualSuccessRate] = useState(0);
    const [successRate, setSuccessRate] = useState(0);
    const [grade, setGrade] = useState(0);
    const [examGrade, setExamGrade] = useState(0);

    const fetchExam = useCallback(async () => {
        if (!location.state) {
            history.goBack();
        }
        const { state } = location;
        const { examId } = state;
        try {
            const { data: exam } = await http.get(
                `${backendURL}/api/form/exam/review/${examId}`
            );
            setDocName(exam.name);
            setActualSuccessRate(exam.actualSuccessRate);
            setDocDesc(exam.description);
            setQuestions(exam.questions);
            setGrade(exam.grade);
            setExamGrade(exam.actualGrade);
            setSuccessRate(exam.successRate);
        } catch (error) {
            console.log(error.response);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        fetchExam();
    }, [location, fetchExam]);

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
                                Exam Success Rate:
                                <input
                                    type="number"
                                    className="rate"
                                    value={actualSuccessRate}
                                    disabled
                                />
                                %
                            </div>
                            <div
                                style={{
                                    marginTop: '10px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                Your Success Rate:
                                <input
                                    type="number"
                                    className="rate"
                                    value={successRate}
                                    disabled
                                />
                                %
                            </div>
                            <div
                                style={{
                                    marginTop: '10px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                Grade:
                                <span style={{ marginLeft: '15px' }}>
                                    {grade}
                                </span>
                                <span style={{ marginLeft: '15px' }}>
                                    out of
                                </span>
                                <span style={{ marginLeft: '15px' }}>
                                    {examGrade}
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    ({successRate}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        {questions && (
                            <ReviewQuestionUI questions={questions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Review = MotionHoc(QuestionFormComponent);

export default Review;
