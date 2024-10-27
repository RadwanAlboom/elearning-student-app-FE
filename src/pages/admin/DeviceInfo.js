
import React, { useEffect, useState } from "react";
import ReactJson from 'react-json-view';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MotionHoc from "./MotionHoc";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import {
    loadDeviceInfo,
} from "../../store/deviceInfo";

const DeviceInfoComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const deviceInfo = useSelector(
        (state) => state.entities.deviceInfo.list
    );

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        const { studentId } = location.state;
        dispatch(loadDeviceInfo(studentId));
    }, []);

    const displayDeviceInfo = deviceInfo.map((info) => {
        const jsonObject = JSON.parse(info.device_info);
        return (
            <div
                key={info.id}
                style={{marginTop: "20px", marginBottom: "20px"}}
            >
                <ReactJson src={jsonObject} theme="monokai" collapsed={true} />
            </div>
        );
    });

    return (
        <div className="requests-page">
            <div className="requests-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={"1.7rem"}
                        color="#803bec"
                        style={{
                            marginRight: "10px",
                            marginBottom: "5px",
                        }}
                    />
                    معلومات الاجهزة
                </h3>
            </div>
            <div>
                {displayDeviceInfo}
            </div>
        </div>
    );
}

const DeviceInfo = MotionHoc(DeviceInfoComponent);
export default DeviceInfo;
