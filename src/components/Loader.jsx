import React from 'react';
import RequestLoader from './RequestLoader';

export default function Loader() {
    return (
        <div style={{width : '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <RequestLoader width={160} height={160}/>
        </div>
    );
}
