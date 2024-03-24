import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ReactTimeAgo from 'react-time-ago';
import './message.css';

export default function Message({
    message,
    own,
    senderImg,
    recevierImg,
    date,
}) {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                {!own && (
                    <>
                        <Avatar className="messageImg" src={senderImg} alt="" />
                        <p className="messageText">{message}</p>
                    </>
                )}
                {own && (
                    <>
                        <p className="messageText">{message}</p>
                        <Avatar
                            className="messageImg"
                            src={recevierImg}
                            alt=""
                        />
                    </>
                )}
            </div>
            <div className="messageBottom">
                <ReactTimeAgo
                    date={new Date(date)}
                    locale="en-US"
                    timeStyle="facebook"
                />
            </div>
        </div>
    );
}
