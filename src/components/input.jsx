import React from 'react';
import Input from '@material-ui/core/Input';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    input: {
        textAlign: 'right !important',
        padding: '0px 5px 0px 5px'
    },
});

const Inpu = ({ name, label, error, icon, value, onChange, ...rest }) => {
    const classes = useStyles();

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
                    inputProps={{
                        className: classes.input,
                    }}
                />
            </FormControl>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default Inpu;
