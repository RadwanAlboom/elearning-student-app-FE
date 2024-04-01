import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
    id,
    img,
    descreption,
    title,
    url,
    teacherId,
}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <Link
                to={{
                    pathname: url,
                    state: { id, teacherId, title },
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
                <div style={{ width: '100%', height: '27px' }} />
            </CardActions>
        </Card>
    );
}
