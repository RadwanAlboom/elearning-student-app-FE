import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateSharpIcon from '@material-ui/icons/UpdateSharp';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    buttonUpdate: {
        marginRight: '5px',
    },
    buttonDelete: {
        marginLeft: '5px',
    },
});

const zoomLinkClicked = (zoomLink) => {
    
    const aLink = document.createElement("a");
    aLink.href = zoomLink;
    aLink.target = "https://www.google.com/";
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
}

const ZoomLink = ({
    id,
    classCourseName,
    subject,
    date,
    link,
    updateClicked,
    deleteClicked,
}) => {
    const classes = useStyles();
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
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonUpdate}
                    startIcon={<UpdateSharpIcon />}
                    onClick={() => updateClicked(id)}
                >
                    تحديث
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonDelete}
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteClicked(id)}
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

export default ZoomLink;
