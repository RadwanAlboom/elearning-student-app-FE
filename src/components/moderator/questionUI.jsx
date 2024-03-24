import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Input } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import ShortTextIcon from '@material-ui/icons/ShortText';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { BsTrash } from 'react-icons/bs';
import { IconButton } from '@material-ui/core';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { IoMdAddCircleOutline } from 'react-icons/io';

import { BsFileText } from 'react-icons/bs';
import { Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import { FcRightUp } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

function QuestionUI({
    questions,
    handleExpand,
    handleQuestionValue,
    addQuestionType,
    handleOptionValue,
    removeOption,
    addOption,
    copyQuestion,
    addAnswer,
    deleteQuestion,
    requiredQuestion,
    setOptionPoints,
    setOptionAnswer,
    doneAnswer,
    addMoreQuestionField,
    toggleOpen,
}) {
    return questions.map((ques, i) => (
        <Draggable key={i} draggableId={i + 'id'} index={i}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div>
                        <div style={{ marginBottom: '0px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    marginBottom: '0px',
                                }}
                            >
                                <DragIndicatorIcon
                                    style={{
                                        transform: 'rotate(-90deg)',
                                        color: '#DAE0E2',
                                        position: 'relative',
                                        left: '300px',
                                    }}
                                    fontSize="small"
                                />
                            </div>

                            <Accordion
                                onChange={() => {
                                    handleExpand(i);
                                }}
                                expanded={questions[i].open ? true : false}
                                className={
                                    questions[i].open ? 'add_border' : ''
                                }
                            >
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    elevation={1}
                                    style={{ width: '100%' }}
                                >
                                    {!questions[i].open ? (
                                        <div
                                            className="saved_questions"
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            <Typography
                                                style={{ marginBottom: '10px' }}
                                            >
                                                {i + 1}. {ques.questionText}
                                            </Typography>

                                            {ques.options.map((op, j) => (
                                                <div key={j}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            style={{
                                                                marginLeft:
                                                                    '5px',
                                                                marginBottom:
                                                                    '5px',
                                                                position:
                                                                    'relative',
                                                            }}
                                                            disabled
                                                            control={
                                                                <div className="div-circle">
                                                                    <input
                                                                        type={
                                                                            ques.questionType
                                                                        }
                                                                        color="primary"
                                                                        style={{
                                                                            marginRight:
                                                                                '3px',
                                                                        }}
                                                                        required={
                                                                            ques.type
                                                                        }
                                                                    />
                                                                </div>
                                                            }
                                                            label={
                                                                <Typography className="option-text">
                                                                    {
                                                                        ques
                                                                            .options[
                                                                            j
                                                                        ]
                                                                            .optionText
                                                                    }
                                                                </Typography>
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </AccordionSummary>
                                <div className="question_boxes">
                                    {!ques.answer ? (
                                        <AccordionDetails className="add_question">
                                            <div>
                                                <div className="add_question_top">
                                                    <textarea
                                                        value={
                                                            ques.questionText
                                                        }
                                                        rows="1"
                                                        className="question"
                                                        placeholder="Question"
                                                        onChange={(e) => {
                                                            handleQuestionValue(
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                    ></textarea>

                                                    <Select
                                                        defaultValue=""
                                                        className="select"
                                                        style={{
                                                            color: '#5f6368',
                                                            fontSize: '13px',
                                                        }}
                                                    >
                                                        <MenuItem
                                                            id="radio"
                                                            value="Radio"
                                                            onClick={() => {
                                                                addQuestionType(
                                                                    i,
                                                                    'radio'
                                                                );
                                                            }}
                                                        >
                                                            <Radio
                                                                style={{
                                                                    marginRight:
                                                                        '10px',
                                                                    color: '#70757a',
                                                                }}
                                                                checked
                                                            />
                                                            Multiple Choice
                                                        </MenuItem>
                                                    </Select>
                                                </div>

                                                {ques.options.map((op, j) => (
                                                    <div
                                                        className="add_question_body"
                                                        key={j}
                                                    >
                                                        {ques.questionType !==
                                                        'text' ? (
                                                            <input
                                                                type={
                                                                    ques.questionType
                                                                }
                                                                style={{
                                                                    marginRight:
                                                                        '10px',
                                                                }}
                                                            />
                                                        ) : (
                                                            <ShortTextIcon
                                                                style={{
                                                                    marginRight:
                                                                        '10px',
                                                                }}
                                                            />
                                                        )}
                                                        <div className="div-text">
                                                            <input
                                                                type="text"
                                                                className="text_input"
                                                                placeholder="option1"
                                                                value={
                                                                    ques
                                                                        .options[
                                                                        j
                                                                    ].optionText
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleOptionValue(
                                                                        e.target
                                                                            .value,
                                                                        i,
                                                                        j
                                                                    );
                                                                }}
                                                            ></input>
                                                        </div>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                removeOption(
                                                                    i,
                                                                    j
                                                                );
                                                            }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </div>
                                                ))}

                                                {ques.options.length < 5 ? (
                                                    <div className="add_question_body">
                                                        <FormControlLabel
                                                            disabled
                                                            control={
                                                                ques.questionType !==
                                                                'text' ? (
                                                                    <Input
                                                                        type={
                                                                            ques.questionType
                                                                        }
                                                                        color="primary"
                                                                        inputProps={{
                                                                            'aria-label':
                                                                                'secondary checkbox',
                                                                        }}
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginRight:
                                                                                '10px',
                                                                        }}
                                                                        disabled
                                                                    />
                                                                ) : (
                                                                    <ShortTextIcon
                                                                        style={{
                                                                            marginRight:
                                                                                '10px',
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                            label={
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        className="text_input"
                                                                        style={{
                                                                            fontSize:
                                                                                '13px',
                                                                            width: '60px',
                                                                        }}
                                                                        placeholder="Add other"
                                                                    ></input>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() => {
                                                                            addOption(
                                                                                i
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            textTransform:
                                                                                'none',
                                                                            color: '#4285f4',
                                                                            fontSize:
                                                                                '13px',
                                                                            fontWeight:
                                                                                '600',
                                                                        }}
                                                                    >
                                                                        Add
                                                                        Option
                                                                    </Button>
                                                                </div>
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                                <div className="add_footer">
                                                    <div className="add_question_bottom_left">
                                                        <Button
                                                            size="small"
                                                            onClick={() => {
                                                                addAnswer(i);
                                                            }}
                                                            style={{
                                                                textTransform:
                                                                    'none',
                                                                color: '#4285f4',
                                                                fontSize:
                                                                    '13px',
                                                                fontWeight:
                                                                    '600',
                                                            }}
                                                        >
                                                            <FcRightUp
                                                                style={{
                                                                    border: '2px solid #4285f4',
                                                                    padding:
                                                                        '2px',
                                                                    marginRight:
                                                                        '8px',
                                                                }}
                                                            />
                                                            Answer key
                                                        </Button>
                                                    </div>

                                                    <div className="add_question_bottom">
                                                        <IconButton
                                                            aria-label="Copy"
                                                            onClick={() => {
                                                                copyQuestion(i);
                                                            }}
                                                        >
                                                            <FilterNoneIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                deleteQuestion(
                                                                    i
                                                                );
                                                            }}
                                                        >
                                                            <BsTrash />
                                                        </IconButton>
                                                        <span
                                                            style={{
                                                                color: '#5f6368',
                                                                fontSize:
                                                                    '13px',
                                                            }}
                                                        >
                                                            Required
                                                        </span>
                                                        <Switch
                                                            name="checkedA"
                                                            color="primary"
                                                            checked={
                                                                ques.required
                                                                    ? true
                                                                    : false
                                                            }
                                                            onClick={() => {
                                                                requiredQuestion(
                                                                    i
                                                                );
                                                            }}
                                                        />
                                                        <IconButton
                                                            onClick={() =>
                                                                toggleOpen(i)
                                                            }
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    ) : (
                                        <AccordionDetails className="add_question">
                                            <div className="top_header">
                                                Choose Correct Answer:
                                                <span className="answer-key">
                                                    {ques.answerKey}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="add_question_top">
                                                    <input
                                                        type="text"
                                                        className="question "
                                                        placeholder="Question"
                                                        value={
                                                            ques.questionText
                                                        }
                                                        onChange={(e) => {
                                                            handleQuestionValue(
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                        disabled
                                                    />
                                                    <input
                                                        type="number"
                                                        className="points"
                                                        min="1"
                                                        step="1"
                                                        value={ques.points}
                                                        placeholder="1"
                                                        onChange={(e) => {
                                                            setOptionPoints(
                                                                e.target.value,
                                                                i
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                {ques.options.map((op, j) => (
                                                    <div
                                                        className="add_question_body"
                                                        key={j}
                                                        style={{
                                                            marginLeft: '8px',
                                                            marginBottom:
                                                                '10px',
                                                            marginTop: '5px',
                                                        }}
                                                    >
                                                        <div key={j}>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                }}
                                                                className=""
                                                            >
                                                                <div className="form-check">
                                                                    <label
                                                                        style={{
                                                                            fontSize:
                                                                                '13px',
                                                                        }}
                                                                        onClick={() => {
                                                                            setOptionAnswer(
                                                                                ques
                                                                                    .options[
                                                                                    j
                                                                                ]
                                                                                    .optionText,
                                                                                i
                                                                            );
                                                                        }}
                                                                    >
                                                                        {ques.questionType !==
                                                                        'text' ? (
                                                                            <input
                                                                                type={
                                                                                    ques.questionType
                                                                                }
                                                                                name={
                                                                                    ques.questionText
                                                                                }
                                                                                value="option3"
                                                                                className="form-check-input"
                                                                                required={
                                                                                    ques.required
                                                                                }
                                                                                style={{
                                                                                    marginRight:
                                                                                        '10px',
                                                                                    marginBottom:
                                                                                        '10px',
                                                                                    marginTop:
                                                                                        '5px',
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <ShortTextIcon
                                                                                style={{
                                                                                    marginRight:
                                                                                        '10px',
                                                                                }}
                                                                            />
                                                                        )}

                                                                        {
                                                                            ques
                                                                                .options[
                                                                                j
                                                                            ]
                                                                                .optionText
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="add_question_body">
                                                    <Button
                                                        size="small"
                                                        style={{
                                                            textTransform:
                                                                'none',
                                                            color: '#4285f4',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        <BsFileText
                                                            style={{
                                                                fontSize:
                                                                    '20px',
                                                                marginRight:
                                                                    '8px',
                                                            }}
                                                        />
                                                        Add Answer Feedback
                                                    </Button>
                                                </div>

                                                <div className="add_question_bottom">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        style={{
                                                            textTransform:
                                                                'none',
                                                            color: '#4285f4',
                                                            fontSize: '12px',
                                                            marginTop: '12px',
                                                            fontWeight: '600',
                                                        }}
                                                        onClick={() => {
                                                            doneAnswer(i);
                                                        }}
                                                    >
                                                        Done
                                                    </Button>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    )}
                                    {!ques.answer ? (
                                        <div className="question_edit">
                                            <IoMdAddCircleOutline
                                                onClick={addMoreQuestionField}
                                                size="1.7rem"
                                            />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    ));
}

export default QuestionUI;
