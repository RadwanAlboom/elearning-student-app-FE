import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { BsXDiamondFill } from "react-icons/bs";

import userImg from "../../assets/user.jpg";

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
                style={{ textDecoration: "none" }}
            >
                <CardActionArea>
                    <CardMedia
                        className={classes.media + " user-icon-container"}
                        image={img}
                        title={name}
                        style={{ height: "220px" }}
                    >
                        <div className="user-icon">
                            <img
                                src={userImg}
                                alt={name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </CardMedia>
                    <CardContent
                        style={{
                            color: "black",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ width: "50vw", height: "40px" }}></div>
                        <div style={{ display: "flex" }}>
                            <div style={{ order: 3 }}>
                                <FaUserTie style={{ marginLeft: "10px" }} />
                            </div>
                            <div style={{ marginLeft: "5px", order: 2 }}>
                                :المعلم
                            </div>
                            <div style={{ order: 1 }}>{name}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ order: 3 }}>
                                <IoMail style={{ marginLeft: "10px" }} />
                            </div>
                            <div style={{ marginLeft: "5px", order: 2 }}>
                                :البريد
                            </div>
                            <div style={{ order: 1 }}>{email}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ order: 3 }}>
                                <BsXDiamondFill
                                    style={{ marginLeft: "10px" }}
                                />
                            </div>
                            <div style={{ marginLeft: "5px", order: 2 }}>
                                :التخصص
                            </div>
                            <div style={{ order: 1 }}>{major}</div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions
                style={{ backgroundColor: "#0f0f15", justifyContent: "center" }}
            >
                <div style={{ width: "100%", height: "27px" }}></div>
            </CardActions>
        </Card>
    );
}
