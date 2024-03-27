import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Upload from '../../components/upload';
import uploadAnim from '../../assets/Animation/7877-uploading-to-cloud.json';
import ProgressBar from '../../components/progressBar';

const useStyles = makeStyles({
    root: {
        textAlign: 'right !important'
    },

    footer: {
        justifyContent: 'flex-start !important'
    }
});


const VerticalModal = ({ formTitle, progress = 0, ...other }) => {
    const classes = useStyles();

    return (
        <Modal
            {...other}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className= {classes.root}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {formTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{other.children}</Modal.Body>
            <div
                style={{
                    padding: '15px 10px 12px 15px',
                    backgroundColor: '#f7ff76',
                    margin: '30px 10px 0px 10px',
                    borderRadius: '5px',
                    border: '1px solid #c9c9c9',
                }}
            >
                <ProgressBar progress={progress} />
            </div>
            <Upload
                lotti={uploadAnim}
                height={150}
                width={150}
            />
            <Modal.Footer className={classes.footer}>
                <Button onClick={other.onHide}>اغلاق</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerticalModal;
