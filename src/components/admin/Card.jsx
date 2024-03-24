import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateSharpIcon from '@material-ui/icons/UpdateSharp';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function MediaCard({
    img,
    descreption,
    title,
    id,
    updateClicked,
    deleteClicked,
    course,
    url,
}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <Link
                to={{
                    pathname: url,
                    state: { id, classCourseName: title },
                }}
                style={{ textDecoration: 'none' }}
            >
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={img}
                        title={title}
                        style={{ height: '220px' }}
                    />
                    <CardContent>
                        <div style={{ width: '50vw' }}></div>
                        <Typography gutterBottom variant="h5" component="h2">
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {descreption}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions
                style={{ backgroundColor: '#0f0f15', justifyContent: 'center' }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<UpdateSharpIcon />}
                    onClick={() => updateClicked(id, course)}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteClicked(id, course)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}
