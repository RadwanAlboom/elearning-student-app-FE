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
const DropMenuExam = ({ handleChange, val, exams }) => {
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
                <InputLabel id="major">Exams</InputLabel>
                <Select
                    labelId="major"
                    id="major"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={val}
                    onChange={(event) => handleChange(event)}
                    name="Exams"
                >
                    <MenuItem value={0}>
                        <em>None</em>
                    </MenuItem>
                    {exams.map((exam) => (
                        <MenuItem
                            key={exam.id}
                            value={{
                                id: exam.exam_id,
                                name: exam.name,
                                description: exam.description,
                            }}
                        >
                            {exam.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default DropMenuExam;
