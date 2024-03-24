import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Unit extends Component {
    state = {};
    render() {
        const { id, title, component, url, classCourseId, teacherId } =
            this.props;
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
                                state: { id, classCourseId, teacherId },
                            }}
                        >
                            {title}{' '}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Unit;
