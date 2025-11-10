import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Typography } from 'antd';
import { HolderOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AvailableHook = ({ id, title, description }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        marginBottom: 16,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card bodyStyle={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <HolderOutlined style={{ marginRight: 8, color: '#999' }} />
                <div>
                    <Text strong>{title}</Text>
                    <br />
                    <Text type="secondary">{description}</Text>
                </div>
            </Card>
        </div>
    );
};

export default AvailableHook;