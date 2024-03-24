import React from 'react';

import { Typography } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

function QuestionUI({ questions, setOptionAnswer }) {
    return questions.map((ques, i) => (
        <div key={i}>
            <div style={{ marginTop: '40px' }}>
                <Accordion expanded={false} className="add_border">
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        elevation={1}
                        style={{ width: '100%' }}
                    >
                        <div
                            className="saved_questions"
                            style={{ wordBreak: 'break-word' }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography style={{ marginBottom: '10px' }}>
                                    {i + 1}. {ques.questionText}
                                </Typography>
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f5ff95',
                                        borderRadius: '5px',
                                        padding: '10px',
                                    }}
                                >
                                    <span style={{ marginRight: '5px' }}>
                                        {ques.points}
                                    </span>
                                    <span>Points</span>
                                </div>
                            </div>

                            <FormControl component="fieldset">
                                <RadioGroup
                                    name={ques.questionText + '' + i + 2}
                                    key={ques.questionText + '' + i + 2}
                                >
                                    {ques.options.map((op, j) => (
                                        <div key={j}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                <FormControlLabel
                                                    style={{
                                                        marginLeft: '5px',
                                                        marginBottom: '5px',
                                                        position: 'relative',
                                                    }}
                                                    control={
                                                        <div
                                                            className="div-circle"
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
                                                            <Radio
                                                                value={
                                                                    op.id + ''
                                                                }
                                                                name={
                                                                    ques.questionText +
                                                                    '' +
                                                                    i +
                                                                    1
                                                                }
                                                            />
                                                        </div>
                                                    }
                                                    label={
                                                        <Typography className="option-text">
                                                            {
                                                                ques.options[j]
                                                                    .optionText
                                                            }
                                                        </Typography>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </AccordionSummary>
                </Accordion>
            </div>
        </div>
    ));
}

export default QuestionUI;
