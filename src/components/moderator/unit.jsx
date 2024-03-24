import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateSharpIcon from '@material-ui/icons/UpdateSharp';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Unit extends Component {
    state = {};
    render() {
        const {
            id,
            chapter,
            title,
            component,
            link,
            updateClicked,
            deleteClicked,
        } = this.props;
        return (
            <div className="admin-unit">
                <div className="title-container">
                    <div className="unit-icon">
                        <div className="icon">{component}</div>
                    </div>

                    <div className="title">
                        <Link to={link}>{title} </Link>
                    </div>
                </div>
                <div className="actions-container">
                    <div className="btn-conatiner">
                        <div className="update-btn">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<UpdateSharpIcon />}
                                onClick={() => updateClicked(id, chapter)}
                            >
                                Update
                            </Button>
                        </div>
                        <div className="delete-btn">
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => deleteClicked(id, chapter)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Unit;
