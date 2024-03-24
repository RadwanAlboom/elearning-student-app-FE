import React from 'react';

const FileBrowser = ({ name, label, error, ...rest }) => {
    return (
        <div className="custom-file">
            <input
                {...rest}
                name={name}
                id={name}
                className="custom-file-input"
                style={{ height: '45px' }}
            />
            <label
                htmlFor={name}
                className="custom-file-label"
                style={{
                    backgroundColor: '#f7ff76',
                    height: '45px',
                    paddingTop: '12px',
                }}
            >
                {label}
            </label>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default FileBrowser;
