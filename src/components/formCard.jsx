import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));
const FormCard = ({ title, handleFormSwape }) => {
    const classes = useStyles();
    return (
        <div className="card-section">
            <div className="space"></div>
            <h1 style={{ marginBottom: '20px' }}>Hello, Students!</h1>
            <p>
                Enter the required account details and start your learning
                journey with us
            </p>
            <div className="div-btn">
                <Button
                    variant="contained"
                    className={`${classes.button} register-btn`}
                    onClick={() => handleFormSwape()}
                >
                    {title}
                </Button>
            </div>
            <div className="space"></div>
        </div>
    );
};

export default FormCard;
