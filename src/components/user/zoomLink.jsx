import { Link } from '@material-ui/core';
import React from 'react';

const zoomLinkClicked = (zoomLink) => {
    
    const aLink = document.createElement("a");
    aLink.href = zoomLink;
    aLink.target = "https://www.google.com/";
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
}

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
                <div className="break-info" onClick={() => zoomLinkClicked(link)}>
                    <Link style={{color: '#4d90f5'}}>Join Zoom Meeting</Link>
                </div>
            </div>
        </div>
    );
};

export default ZoomLink;
