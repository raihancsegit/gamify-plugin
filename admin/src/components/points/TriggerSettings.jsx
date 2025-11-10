import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Space, Button, Typography, Flex, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { saveTriggers } from '../../store/features/triggersSlice';
import PointTypeSelector from './PointTypeSelector';
import AutomaticAwards from './AutomaticAwards';

const { Title, Text } = Typography;

const TriggerSettings = ({ pointTypeId, onBack }) => {
    const dispatch = useDispatch();
    const { active, status } = useSelector((state) => state.triggers);

    const handleSaveChanges = () => {
        // Format the data as required by the backend API: { trigger_key: points }
        const activeHooksData = {
            active_hooks: active.reduce((acc, hook) => {
                acc[hook.id] = hook.points;
                return acc;
            }, {})
        };

        dispatch(saveTriggers(activeHooksData))
            .unwrap()
            .then(() => {
                message.success('Settings saved successfully!');
            })
            .catch((error) => {
                message.error(error.message || 'Failed to save settings.');
            });
    };

    return (
        <div>
            <div style={{ background: '#fff', padding: '16px 24px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Flex align="center" gap="middle">
                    <Button type="text" shape="circle" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginRight: '8px' }} />
                    <div>
                        <Title level={4} style={{ margin: 0, lineHeight: '1.2' }}>
                            {pointTypeId ? "Edit Point Type" : "Add New Point Type"}
                        </Title>
                        <Text type="secondary">
                            Configure automatic point awards and deductions
                        </Text>
                    </div>
                </Flex>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <PointTypeSelector pointTypeId={pointTypeId} />
                <AutomaticAwards pointTypeId={pointTypeId} />

                <div style={{ textAlign: 'right', marginTop: '16px' }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSaveChanges}
                        loading={status === 'saving'}
                        style={{ borderRadius: '6px' }}
                    >
                        Save Changes
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default TriggerSettings;