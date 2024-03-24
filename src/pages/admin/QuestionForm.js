import React, { useState, useEffect, useCallback } from 'react';
import socketIOClient from 'socket.io-client';
import { useHistory, useLocation } from 'react-router-dom';
import MotionHoc from './MotionHoc';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';

import http from '../../services/httpService';
import QuestionUI from '../../components/admin/questionUI';
import * as examService from '../../services/examService';
import './QuestionForm.css';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

function QuestionFormComponent() {
    let history = useHistory();
    let location = useLocation();

    const [questions, setQuestions] = useState([
        {
            questionText: 'Question',
            answer: false,
            answerKey: '',
            questionType: 'radio',
            points: 1,
            options: [{ optionText: 'Option 1' }],
            open: true,
            required: true,
        },
    ]);
    const [documentName, setDocName] = useState('untitled Document');
    const [documentDescription, setDocDesc] = useState('Add Description');
    const [successRate, setSuccessRate] = useState(70);
    const [editExamId, setEditExamId] = useState('');
    const [isEditExam, setIsEditExam] = useState(false);
    const [chapterId, setChapterId] = useState('');

    const fetchExam = useCallback(async () => {
        const { state } = location;
        if (state === undefined) {
            history.goBack();
        }
        if (state.id) setChapterId(state.id);
        if (state.isEdit) {
            const { isEdit, examId } = state;
            const { data: exam } = await http.get(
                `${backendURL}/api/form/exams/${examId}`
            );
            setDocName(exam.name);
            setDocDesc(exam.description);
            setQuestions(exam.questions);
            setSuccessRate(exam.successRate);
            setEditExamId(examId);
            setIsEditExam(isEdit);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    useEffect(() => {
        fetchExam();
    }, [history, fetchExam]);

    function addMoreQuestionField() {
        expandCloseAll(); //I AM GOD

        setQuestions((questions) => [
            ...questions,
            {
                questionText: 'Question',
                questionType: 'radio',
                options: [{ optionText: 'Option 1' }],
                open: true,
                required: true,
            },
        ]);
    }

    function setOptionAnswer(ans, qno) {
        var Questions = [...questions];
        Questions[qno].answerKey = ans;
        setQuestions(Questions);
    }

    function setOptionPoints(points, qno) {
        var Questions = [...questions];
        Questions[qno].points = points;
        setQuestions(Questions);
    }

    function deleteQuestion(i) {
        let qs = [...questions];
        if (questions.length > 1) {
            qs.splice(i, 1);
        }
        setQuestions(qs);
    }

    function requiredQuestion(i) {
        var requiredQuestion = [...questions];
        requiredQuestion[i].required = true;
        setQuestions(requiredQuestion);
    }

    function addAnswer(i) {
        var answerOfQuestion = [...questions];
        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
        setQuestions(answerOfQuestion);
    }

    function doneAnswer(i) {
        var answerOfQuestion = [...questions];
        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
        setQuestions(answerOfQuestion);
    }

    function copyQuestion(i) {
        let qs = [...questions];
        expandCloseAll();
        const myNewOptions = [];
        qs[i].options.forEach((opn) => {
            var opn1new = {
                optionText: opn.optionText,
            };
            myNewOptions.push(opn1new);
        });

        var newQuestion = {
            questionText: qs[i].questionText,
            answer: qs[i].answer,
            answerKey: qs[i].answerKey,
            points: qs[i].points,
            questionType: qs[i].questionType,
            options: myNewOptions,
            open: true,
            required: true,
        };
        setQuestions((questions) => [...questions, newQuestion]);
    }

    function expandCloseAll() {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            qs[j].open = false;
        }
        setQuestions(qs);
    }

    function addOption(i) {
        var optionsOfQuestion = [...questions];
        if (optionsOfQuestion[i].options.length < 5) {
            optionsOfQuestion[i].options.push({
                optionText:
                    'Option ' + (optionsOfQuestion[i].options.length + 1),
            });
        }
        setQuestions(optionsOfQuestion);
    }

    function removeOption(i, j) {
        var optionsOfQuestion = [...questions];
        if (optionsOfQuestion[i].options.length > 1) {
            optionsOfQuestion[i].options.splice(j, 1);
            setQuestions(optionsOfQuestion);
        }
    }

    function handleOptionValue(text, i, j) {
        var optionsOfQuestion = [...questions];
        optionsOfQuestion[i].options[j].optionText = text;
        setQuestions(optionsOfQuestion);
    }

    function addQuestionType(i, type) {
        let qs = [...questions];
        qs[i].questionType = type;
        setQuestions(qs);
    }

    function handleQuestionValue(text, i) {
        var optionsOfQuestion = [...questions];
        optionsOfQuestion[i].questionText = text;
        setQuestions(optionsOfQuestion);
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        var itemgg = [...questions];
        const itemF = reorder(
            itemgg,
            result.source.index,
            result.destination.index
        );
        setQuestions(itemF);
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    function handleExpand(i) {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            if (i === j) {
                qs[i].open = true;
            } else {
                qs[j].open = false;
            }
        }
        setQuestions(qs);
    }

    function toggleOpen(i) {
        let qs = [...questions];
        qs[i].open = false;
        setQuestions(qs);
    }

    const saveClicked = async () => {
        const API_URL = `/chapters/${chapterId}/exams`;
        const redirect_URL = `/admin/courses/teachers/classCourses/chapters/lessons`;
        if (isEditExam) {
            try {
                await examService.editForm(
                    documentName,
                    documentDescription,
                    questions,
                    successRate,
                    `${API_URL}/${editExamId}`
                );
                toast.success('Exam updated successfully');

                socket = socketIOClient(backendURL);
                socket.emit('exams', { payload: 'updated' }, (error) => {});

                history.push({
                    pathname: redirect_URL,
                    state: {
                        id: chapterId,
                    },
                });
            } catch (ex) {
                console.log(ex);
            }
        } else {
            try {
                await examService.autoSave(
                    documentName,
                    documentDescription,
                    questions,
                    successRate,
                    API_URL
                );
                toast.success('Exam added successfully');

                socket = socketIOClient(backendURL);
                socket.emit('exams', { payload: 'saved' }, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

                history.push({
                    pathname: redirect_URL,
                    state: {
                        id: chapterId,
                    },
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    };

    const prevntTyping = (e) => {
        e.preventDefault();
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
                                className="question_form_top_name"
                                style={{ color: 'black' }}
                                placeholder="Document Title"
                                value={documentName}
                                onChange={(e) => {
                                    setDocName(e.target.value);
                                }}
                            ></input>
                            <input
                                type="text"
                                className="question_form_top_desc"
                                placeholder="Form Description"
                                value={documentDescription}
                                onChange={(e) => {
                                    setDocDesc(e.target.value);
                                }}
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
                                    min="0"
                                    step="5"
                                    max="100"
                                    value={successRate}
                                    placeholder="70"
                                    onKeyPress={(e) => prevntTyping(e)}
                                    onChange={(e) => {
                                        setSuccessRate(e.target.value);
                                    }}
                                />
                                %
                            </div>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <QuestionUI
                                        questions={questions}
                                        handleExpand={handleExpand}
                                        handleQuestionValue={
                                            handleQuestionValue
                                        }
                                        addQuestionType={addQuestionType}
                                        handleOptionValue={handleOptionValue}
                                        removeOption={removeOption}
                                        addOption={addOption}
                                        copyQuestion={copyQuestion}
                                        addAnswer={addAnswer}
                                        deleteQuestion={deleteQuestion}
                                        requiredQuestion={requiredQuestion}
                                        setOptionPoints={setOptionPoints}
                                        setOptionAnswer={setOptionAnswer}
                                        doneAnswer={doneAnswer}
                                        addMoreQuestionField={
                                            addMoreQuestionField
                                        }
                                        toggleOpen={toggleOpen}
                                    />

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="save_form">
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ fontSize: '14px' }}
                            onClick={saveClicked}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuestionForm = MotionHoc(QuestionFormComponent);

export default QuestionForm;
