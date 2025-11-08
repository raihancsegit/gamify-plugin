import React from 'react';
import { Row, Col, Card, Typography, DatePicker, Table, Space } from 'antd';
import { Area } from '@ant-design/charts';
import { StarOutlined, TrophyOutlined, RiseOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Data for Point Distribution Chart
const chartData = [
    { date: '29 May, 25', value: 1.8 }, { date: '30 May, 25', value: 1.5 },
    { date: '31 May, 25', value: 2.5 }, { date: '01 Jun, 25', value: 2.0 },
    { date: '02 Jun, 25', value: 3.2 }, { date: '03 Jun, 25', value: 3.8 },
    { date: '04 Jun, 25', value: 3.5 },
];

// Config for the Area Chart
const chartConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    height: 250,
    xAxis: { tickCount: 5 },
    yAxis: { grid: { line: { style: { stroke: '#eee' } } } },
    areaStyle: () => ({ fill: 'l(270) 0:#ffffff 1:#7ec2f3' }),
    line: { color: '#1890ff' },
    smooth: true,
    legend: {
        custom: true,
        items: [
            { name: 'Points', value: 'points', marker: { symbol: 'circle', style: { fill: '#facc15' } } },
            { name: 'Achievements', value: 'achievements', marker: { symbol: 'circle', style: { fill: '#34d399' } } },
            { name: 'Levels', value: 'levels', marker: { symbol: 'circle', style: { fill: '#a78bfa' } } },
        ],
    },
};

// Data for Top 5 Users Table
const topUsersColumns = [
    { title: 'Rank', dataIndex: 'rank', key: 'rank', render: text => <Text strong>{text}</Text> },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Points', dataIndex: 'points', key: 'points' },
    { title: 'Achievements', dataIndex: 'achievements', key: 'achievements' },
    { title: 'Levels', dataIndex: 'levels', key: 'levels' },
];

const topUsersData = [
    { key: '1', rank: '#1', user: 'Christopher Hayes', points: '10,000', achievements: '5', levels: 'Diamond' },
    { key: '2', rank: '#2', user: 'Nicholas Grant', points: '9,400', achievements: '4', levels: 'Platinum' },
    { key: '3', rank: '#3', user: 'Alexander Pierce', points: '9,200', achievements: '4', levels: 'Platinum' },
    { key: '4', rank: '#4', user: 'Nathaniel Brooks', points: '8,000', achievements: '2', levels: 'Gold' },
    { key: '5', rank: '#5', user: 'Frederick Adams', points: '6,000', achievements: '1', levels: 'Silver' },
];

const StatCard = ({ icon, value, title, color }) => (
    <Card style={{ backgroundColor: color, borderRadius: '8px' }} bordered={false}>
        <Space align="center" size="large">
            <div style={{ fontSize: '32px', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '12px', lineHeight: 0 }}>
                {icon}
            </div>
            <div>
                <Title level={2} style={{ color: '#000', margin: 0 }}>{value}</Title>
                <Text style={{ color: '#4A5568' }}>{title}</Text>
            </div>
        </Space>
    </Card>
);

const Dashboard = () => {
    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Overview</Title>
                </Col>
                <Col>
                    <RangePicker suffixIcon={<CalendarOutlined />} />
                </Col>
            </Row>

            {/* Stat Cards */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<StarOutlined />} value="12,000" title="Points Given" color="#FFFBEB" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<TrophyOutlined />} value="64" title="Achievements Given" color="#E0F2FE" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<RiseOutlined />} value="64" title="Levels Given" color="#F0FDF4" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<UserOutlined />} value="192" title="Active Users" color="#FEF2F2" />
                </Col>
            </Row>

            {/* Point Distribution Chart */}
            <Card title={<Title level={4}>Point Distribution Chart</Title>} bordered={false} style={{ borderRadius: '8px' }}>
                <Area {...chartConfig} />
            </Card>

            {/* Top 5 Users Table */}
            <Card title={<Title level={4}>Top 5 Users</Title>} bordered={false} style={{ borderRadius: '8px' }}>
                <Table
                    columns={topUsersColumns}
                    dataSource={topUsersData}
                    pagination={false}
                    className="top-users-table"
                    rowClassName={(record, index) => (index === 0 ? 'top-user-row' : '')}
                />
            </Card>
        </Space>
    );
};

export default Dashboard;