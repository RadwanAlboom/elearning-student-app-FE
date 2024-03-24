import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MdOndemandVideo } from 'react-icons/md';
import { AiOutlineMenuFold } from 'react-icons/ai';

import http from '../../services/httpService';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '95%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

let backendURL = process.env.REACT_APP_API_URL;

const CourseCurriculumComponent = () => {
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        fetchChapters();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchChapters = async () => {
        try {
            const { data } = await http.get(
                `${backendURL}/api/courses/classCurriculum/${location.state.classCourseId}`
            );
            setChapters(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (panel, id) => async (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded) {
            try {
                const { data } = await http.get(
                    `${backendURL}/api/courses/classCurriculum/chapters/${id}`
                );
                setLessons(data);
            } catch (error) {
                console.log(error);
            }
        }
    };
    return (
        <div style={{ height: '90vh', overflowY: 'auto' }}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '65px',
                }}
            >
                <div
                    className="courses-header"
                    style={{ width: '95%', marginBottom: '25px' }}
                >
                    <h3>Course Curriculum</h3>
                </div>
                <div className={classes.root} style={{ marginBottom: '30px' }}>
                    {chapters.map((chapter, index) => (
                        <Accordion
                            key={chapter.id}
                            expanded={expanded === `panel${chapter.id}`}
                            onChange={handleChange(
                                `panel${chapter.id}`,
                                chapter.id
                            )}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${chapter.id}bh-content`}
                                id={chapter.id}
                            >
                                <AiOutlineMenuFold
                                    size="2rem"
                                    color="#803bec"
                                />
                                <Typography
                                    className={classes.heading}
                                    style={{
                                        marginTop: '5px',
                                        marginLeft: '5px',
                                    }}
                                >
                                    chapter {index + 1}: {chapter.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ListItem button key={lesson.name}>
                                                <ListItemIcon>
                                                    <MdOndemandVideo
                                                        size={'1.5rem'}
                                                        color="#803bec"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={`lesson ${
                                                        index + 1
                                                    }: ${lesson.name}`}
                                                />
                                            </ListItem>
                                        </div>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CourseCurriculum = MotionHoc(CourseCurriculumComponent);

export default CourseCurriculum;
