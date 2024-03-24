import React, { useEffect, useState } from 'react';
import MotionHoc from './MotionHoc';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';

import http from '../../services/httpService';
import ExamTable from '../../components/admin/examTable';

let backendURL = process.env.REACT_APP_API_URL;

const ExamsComponent = () => {
    const [examPreviews, setExamPreviews] = useState([]);
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await http.get(
            `${backendURL}/api/form/admin/examPreviews/`
        );

        setExamPreviews(data);
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
            <div style={{ marginTop: '25px' }}>
                <ExamTable examPreviews={examPreviews} />
            </div>
        </div>
    );
};

const Exams = MotionHoc(ExamsComponent);

export default Exams;
