import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Typography, Flex, Dropdown, Menu, Spin, Alert } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { fetchPointTypes } from '../../store/features/pointTypesSlice';
const { Title, Text } = Typography;

// Dropdown menu for the action button (AntD v4 syntax)
const menu = (
    <Menu>
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="delete" danger>Delete</Menu.Item>
    </Menu>
);

const PointTypes = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.pointTypes);

    // Fetch data when the component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPointTypes());
        }
    }, [status, dispatch]);

    // Define columns inside the component to access component-level logic if needed
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
        { title: 'Plural Name', dataIndex: 'plural_name', key: 'plural_name' }, // Note: DB column is plural_name
        { title: 'Date', dataIndex: 'date', key: 'date' },
        {
            title: 'Action', key: 'action', align: 'center', render: () => (
                // Dropdown menu for each row
                <Dropdown overlay={<Menu><Menu.Item key="edit">Edit</Menu.Item><Menu.Item key="delete" danger>Delete</Menu.Item></Menu>} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined style={{ fontSize: '20px' }} />} style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' }} />
                </Dropdown>
            )
        },
    ];

    let content;

    if (status === 'loading') {
        content = <Spin size="large" />;
    } else if (status === 'succeeded') {
        content = (
            <Table
                rowSelection={{ type: 'checkbox' }}
                columns={columns}
                dataSource={items}
                pagination={false}
                className="gamify-point-types-table"
            />
        );
    } else if (status === 'failed') {
        content = <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: 0 }}>Point Types</Title>
                <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: '6px' }}>
                    Add new point types
                </Button>
            </Flex>

            {content}
        </div>
    );
};

export default PointTypes;