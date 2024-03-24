import React from 'react';

const TextArea = ({ name, label, error, ...rest }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                {...rest}
                className="form-control"
                id={name}
                rows="3"
                name={name}
            ></textarea>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default TextArea;
