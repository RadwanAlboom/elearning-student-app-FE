import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
const DropDownLevel = ({ handleChange, val }) => {
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
                <InputLabel id="level">Exam Feature</InputLabel>
                <Select
                    labelId="level"
                    id="level"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={val}
                    onChange={(event) => handleChange(event)}
                    name="level"
                >
                    <MenuItem value={0 + ''}>
                        <em>Deactivate</em>
                    </MenuItem>
                    <MenuItem value={1 + ''}>
                        <em>Activate</em>
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default DropDownLevel;
