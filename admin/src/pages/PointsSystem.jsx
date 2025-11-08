import React from 'react';
import PointTypes from '../components/points/PointTypes';
import { Typography } from 'antd';

const { Title } = Typography;

const PointsSystem = () => {
    return (
        <div>
            {/* The Title "Point Types" is now inside the PointTypes component */}
            <PointTypes />
        </div>
    );
};

export default PointsSystem;