import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Typography, Flex, Dropdown, Menu, Spin, Alert } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { fetchPointTypes, setView, setSelectedPointType } from '../../store/features/pointTypesSlice';

const { Title, Text } = Typography;

const PointTypesTable = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.pointTypes);

    // Fetch data from the API when the component first loads
    useEffect(() => {
        // We only fetch if the data hasn't been fetched yet
        if (status === 'idle') {
            dispatch(fetchPointTypes());
        }
    }, [status, dispatch]);

    // Handler for the "Add new point types" button
    const handleAddNewClick = () => {
        dispatch(setSelectedPointType(null)); // No ID for a new type
        dispatch(setView('settings'));
    };

    // Handler for the "Edit" menu item
    const handleEditClick = (record) => {
        dispatch(setSelectedPointType(record.id)); // Set the ID of the type to edit
        dispatch(setView('settings'));
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
        { title: 'Plural Name', dataIndex: 'plural_name', key: 'plural_name' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => ( // We need the record to get its ID
                <Dropdown
                    overlay={
                        <Menu onClick={({ key }) => {
                            if (key === 'edit') handleEditClick(record);
                            // Add delete logic here if needed
                        }}>
                            <Menu.Item key="edit">Edit</Menu.Item>
                            <Menu.Item key="delete" danger>Delete</Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined style={{ fontSize: '20px' }} />} style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' }} />
                </Dropdown>
            )
        },
    ];

    let content;

    if (status === 'loading') {
        content = <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spin size="large" /></div>;
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
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ borderRadius: '6px' }}
                    onClick={handleAddNewClick}
                >
                    Add new point types
                </Button>
            </Flex>
            {content}
        </div>
    );
};

export default PointTypesTable;