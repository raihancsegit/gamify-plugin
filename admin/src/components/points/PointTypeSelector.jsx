import React from 'react';
import { Card, Typography, Select, Row, Col } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const PointTypeSelector = () => {
    // These options will later come from the point_types API
    const pointTypes = [
        { id: 1, name: 'Academy Lms', plural_name: 'Skill Tones' },
        { id: 2, name: 'Coin', plural_name: 'Spark Points' },
        { id: 3, name: 'XP', plural_name: 'Power Gems' },
    ];

    return (
        <Card>
            <Title level={4} style={{ marginBottom: '24px' }}>Point Type</Title>
            <Row gutter={24}>
                <Col span={12}>
                    <Text>Point Name</Text>
                    <Select
                        defaultValue="Academy Lms"
                        style={{ width: '100%', marginTop: '8px' }}
                        size="large"
                    >
                        {pointTypes.map(pt => (
                            <Option key={pt.id} value={pt.name}>{pt.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={12}>
                    <Text>Plural Name</Text>
                    <Select
                        defaultValue="Skill Tones"
                        style={{ width: '100%', marginTop: '8px' }}
                        size="large"
                    >
                        {pointTypes.map(pt => (
                            <Option key={pt.id} value={pt.plural_name}>{pt.plural_name}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </Card>
    );
};

export default PointTypeSelector;