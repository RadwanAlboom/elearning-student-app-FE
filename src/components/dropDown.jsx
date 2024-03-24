import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import ErrorMessage from './errorMessage';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));
const DropDown = ({ handleChange, val, error, majors }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="major">Your major</InputLabel>
                <Select
                    labelId="major"
                    id="major"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={val}
                    onChange={(event) => handleChange(event)}
                    name="major"
                >
                    <MenuItem value={0}>
                        <em>None</em>
                    </MenuItem>
                    {majors.map((major) => (
                        <MenuItem key={major.id} value={major.id}>
                            {major.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ErrorMessage error={error} />
        </div>
    );
};

export default DropDown;
