import React from 'react';
const ZoomLink = ({ classCourseName, subject, date, link }) => {
    return (
        <div className="zoom-card-component">
            <div>
                <span className="link-info">Course Name: </span>
                <div className="break-info">{classCourseName}</div>
            </div>
            <div>
                <span className="link-info">Subject: </span>
                <div className="break-info">{subject}</div>
            </div>
            <div>
                <span className="link-info">Date: </span>{' '}
                <div className="break-info">{date}</div>
            </div>
            <div>
                <span className="link-info">Link: </span>{' '}
                <div className="break-info">
                    <a href={link}>Join Zoom Meeting</a>
                </div>
            </div>
        </div>
    );
};

export default ZoomLink;
