import React, { useState, useEffect } from 'react';
import MotionHoc from './MotionHoc';
import socketIOClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { GoDeviceCameraVideo } from 'react-icons/go';

import { loadLinks } from '../../store/zoom';
import ZoLink from '../../components/user/zoomLink';

let socket;
let backendURL = process.env.REACT_APP_API_URL;

function ZoomLinkComponent(props) {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [classCourseName, setClassCourseName] = useState('');

    const links = useSelector((state) => state.entities.zoom.list);

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        setClassCourseName(location.state.classCourseName);
        dispatch(loadLinks(location.state.classCourseId));
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket = socketIOClient(backendURL);
        socket.on('zoomLink', (payload) => {
            dispatch(loadLinks(location.state.classCourseId));
        });

        return () => socket.disconnect();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const keydownHandler = (e) => {
        if (e.ctrlKey) e.preventDefault();
    };

    const displayLinks = links.map((link) => (
        <div key={link.id} className="zoom-container">
            <ZoLink
                classCourseName={classCourseName}
                subject={link.subject}
                date={link.date}
                link={link.link}
            />
        </div>
    ));
    return (
        <div className="zoom-page" onContextMenu={(e) => e.preventDefault()}>
            <div className="courses-header">
                <h3>
                    <GoDeviceCameraVideo
                        size={'1.7rem'}
                        color="#803bec"
                        style={{
                            marginRight: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    Zoom Links
                </h3>
            </div>
            <div className="zoom-section">{displayLinks}</div>
        </div>
    );
}

const ZoomLink = MotionHoc(ZoomLinkComponent);

export default ZoomLink;
