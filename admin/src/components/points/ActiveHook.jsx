import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Typography, InputNumber, Button } from 'antd';
import { HolderOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ActiveHook = ({ id, title, points, onPointsChange, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: 16,
    };
    return (
        <div ref={setNodeRef} style={style}>
            <Card bodyStyle={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'grab' }} {...attributes} {...listeners}>
                        <HolderOutlined style={{ marginRight: 8, color: '#999' }} />
                        <Text strong>{title}</Text>
                    </div>
                    <div>
                        <InputNumber value={points} onChange={(value) => onPointsChange(id, value)} style={{ marginRight: 8 }} />
                        <Button icon={<DeleteOutlined />} onClick={() => onRemove(id)} danger />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ActiveHook;