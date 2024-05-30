import React from 'react';
import Lottie from 'react-lottie';
import requestLoader from '../assets/admin/request-loader.json'

export default function RequestLoader({ width, height }) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: requestLoader,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div style={{width: '100%'}}>
            <Lottie options={defaultOptions} height={height} width={width} />
        </div>
    );
}
