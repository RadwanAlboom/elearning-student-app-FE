import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { BsXDiamondFill } from 'react-icons/bs';

import userImg from '../../assets/user.jpg';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function TeacherCard({
    id,
    courseId,
    name,
    email,
    major,
    img,
    url,
}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <Link
                to={{
                    pathname: url,
                    state: { teacherId: id, courseId },
                }}
                style={{ textDecoration: 'none' }}
            >
                <CardActionArea>
                    <CardMedia
                        className={classes.media + ' user-icon-container'}
                        image={img}
                        title={name}
                        style={{ height: '220px' }}
                    >
                        <div className="user-icon">
                            <img
                                src={userImg}
                                alt={name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    </CardMedia>
                    <CardContent style={{ color: 'black' }}>
                        <div style={{ width: '50vw', height: '40px' }}></div>
                        <Typography
                            variant="body2"
                            component="p"
                            color="inherit"
                        >
                            <FaUserTie style={{ marginRight: '10px' }} />
                            Teacher: {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="p"
                            color="inherit"
                        >
                            <IoMail style={{ marginRight: '10px' }} />
                            Email: {email}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="p"
                            color="inherit"
                        >
                            <BsXDiamondFill style={{ marginRight: '10px' }} />
                            Major: {major}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions
                style={{ backgroundColor: '#0f0f15', justifyContent: 'center' }}
            >
                <div style={{ width: '100%', height: '27px' }}></div>
            </CardActions>
        </Card>
    );
}
