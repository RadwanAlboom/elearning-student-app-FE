import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';

const SearchDropDown = ({ handleChange, filters, checked}) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <div>
            <FormControl style={{padding: '10px 0px 10px 0px'}}>
                <div style={{marginBottom: '15px'}} className='filters-label'>
                    <InputLabel id="Filters" style={{fontWeight:'bold'}}>Filters:</InputLabel>
                </div>
                <Select
                    labelId="filter"
                    id="filter"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    name="filter"
                >
                    {filters.map((filter) => (
                        <FormControlLabel
                            style={{marginLeft: '10px'}}
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => {
                                        setOpen(true);
                                        handleChange(event);
                                    }}
                                    name={filter}
                                    color="primary"
                                />
                            }
                            label={filter}
                            key={filter}
                        />
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default SearchDropDown;
