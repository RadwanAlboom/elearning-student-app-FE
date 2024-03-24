import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import MotionHoc from './MotionHoc';
import { PDFViewer } from '@react-pdf/renderer';

import http from '../../services/httpService';
import MyDocument from '../../components/doc';

let backendURL = process.env.REACT_APP_API_URL;

const ExportComponent = () => {
    const location = useLocation();
    const history = useHistory();
    const [exams, setExams] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setName(location.state.name);
        setDescription(location.state.description);
        fetchExams();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchExams = async () => {
        const { data } = await http.get(
            `${backendURL}/api/form/moderator/exportExam/${location.state.id}`
        );

        setExams(data);
    };
    return (
        <PDFViewer width="100%" height="700px">
            <MyDocument exams={exams} name={name} description={description} />
        </PDFViewer>
    );
};

const Export = MotionHoc(ExportComponent);

export default Export;
