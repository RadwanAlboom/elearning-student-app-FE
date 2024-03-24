import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const VerticalModal = ({ formTitle, ...other }) => {
    return (
        <Modal
            {...other}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {formTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{other.children}</Modal.Body>
            <Modal.Footer>
                <Button onClick={other.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerticalModal;
