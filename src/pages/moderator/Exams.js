import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';

import http from '../../services/httpService';
import auth from '../../services/authService';
import ExamTable from '../../components/moderator/examTable';
import DropMenuExam from '../../components/dropMenuExam';

let backendURL = process.env.REACT_APP_API_URL;

const ExamsComponent = () => {
    let history = useHistory();
    const [examPreviews, setExamPreviews] = useState([]);
    const [exams, setExams] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        let currentUser = auth.getCurrentUser();
        const { data } = await http.get(
            `${backendURL}/api/form/moderator/examPreviews/${currentUser.id}`
        );

        setExamPreviews(data);
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        const { data } = await http.get(
            `${backendURL}/api/form/moderator/exams/${auth.getCurrentUser().id}`
        );

        setExams(data);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
        if (event.target.value) {
            history.push({
                pathname: '/moderator/export',
                state: {
                    id: event.target.value.id,
                    name: event.target.value.name,
                    description: event.target.value.description,
                },
            });
        }
    };
    return (
        <div className="requests-page">
            <div className="requests-header" style={{ height: '55px' }}>
                <h3>
                    <BsFillGrid3X3GapFill
                        size={'1.7rem'}
                        color="#803bec"
                        style={{
                            marginRight: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    Exams
                </h3>
            </div>
            <div className="exam-drop">
                <DropMenuExam
                    exams={exams}
                    handleChange={handleChange}
                    val={value}
                />
            </div>
            <div style={{ marginTop: '0px' }}>
                <ExamTable examPreviews={examPreviews} />
            </div>
        </div>
    );
};

const Exams = MotionHoc(ExamsComponent);

export default Exams;
