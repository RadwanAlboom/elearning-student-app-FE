import React from 'react';
import Input from '@material-ui/core/Input';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const Inpu = ({ name, label, error, icon, value, onChange, ...rest }) => {
    return (
        <div className="form-group">
            <div>
                {icon} {label}
            </div>
            <FormControl>
                <InputLabel htmlFor={name}></InputLabel>
                <Input
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    autoComplete="username"
                    {...rest}
                />
            </FormControl>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Inpu;
