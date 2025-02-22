import React, { Component } from "react";
import UpdateSharpIcon from "@material-ui/icons/UpdateSharp";
import AddCircleSharpIcon from "@material-ui/icons/AddCircleSharp";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

class Unit extends Component {
    state = {};
    render() {
        const {
            id,
            chapter,
            title,
            component,
            updateClicked,
            deleteClicked,
            addStudentClicked,
            url,
        } = this.props;
        return (
            <div className="admin-unit">
                <div className="title-container">
                    <div className="unit-icon">
                        <div className="icon">{component}</div>
                    </div>

                    <div className="title">
                        <Link
                            to={{
                                pathname: url,
                                state: { id },
                            }}
                        >
                            {title}{" "}
                        </Link>
                    </div>
                </div>
                <div className="actions-container">
                    <div className="btn-conatiner">
                        <div className="update-btn">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddCircleSharpIcon />}
                                onClick={() =>
                                    addStudentClicked(id, title)
                                }
                            >
                                اضف طالب
                            </Button>
                        </div>
                        <div className="update-btn">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<UpdateSharpIcon />}
                                onClick={() => updateClicked(id, chapter)}
                            >
                                تحديث
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Unit;
