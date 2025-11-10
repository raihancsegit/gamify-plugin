import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, useDroppable, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Typography, Row, Col, Select, Spin, Alert } from 'antd';
import { fetchTriggers, updateTriggerLists, updateHookPoints } from '../../store/features/triggersSlice';
import AvailableHook from './AvailableHook';
import ActiveHook from './ActiveHook';

const { Title, Text } = Typography;

// A small helper component to create a droppable area
const DroppableContainer = ({ id, children, title, description }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} style={{ border: '1px solid #d9d9d9', padding: 16, borderRadius: 6, minHeight: 400, background: id === 'active-hooks' ? '#fafafa' : '#fff' }}>
            <Title level={5}>{title}</Title>
            <Text type="secondary">{description}</Text>
            {children}
        </div>
    );
};

const AutomaticAwards = () => {
    const dispatch = useDispatch();
    const { available, active, status, error } = useSelector((state) => state.triggers);

    // Fetch initial data when the component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTriggers());
        }
    }, [status, dispatch]);

    const handleDragEnd = (event) => {
        const { active: activeItem, over } = event;
        if (!over) return;

        const activeId = activeItem.id;
        const overId = over.id;

        const isMovingToActive = overId === 'active-hooks' && available.some(h => h.id === activeId);
        const isMovingToAvailable = overId === 'available-hooks' && active.some(h => h.id === activeId);

        let newAvailable = [...available];
        let newActive = [...active];

        if (isMovingToActive) {
            const hookToMove = available.find(h => h.id === activeId);
            newAvailable = available.filter(h => h.id !== activeId);
            newActive = [...active, { ...hookToMove, points: 5 }]; // Add with default points
        } else if (isMovingToAvailable) {
            const hookToMove = active.find(h => h.id === activeId);
            const { points, ...rest } = hookToMove;
            newActive = active.filter(h => h.id !== activeId);
            newAvailable = [...available, rest];
        }

        // Dispatch an action to update the Redux store with the new lists
        dispatch(updateTriggerLists({ available: newAvailable, active: newActive }));
    };

    const handlePointsChange = (id, points) => {
        dispatch(updateHookPoints({ id, points }));
    };

    const handleRemoveActive = (id) => {
        const hookToMove = active.find(h => h.id === id);
        if (hookToMove) {
            const { points, ...rest } = hookToMove;
            const newActive = active.filter(h => h.id !== id);
            const newAvailable = [...available, rest];
            dispatch(updateTriggerLists({ available: newAvailable, active: newActive }));
        }
    };

    if (status === 'loading' || status === 'idle') {
        return <Card><div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div></Card>;
    }

    if (status === 'failed') {
        return <Card><Alert message="Error" description={error} type="error" showIcon /></Card>;
    }

    return (
        <Card>
            <Title level={4}>Automatic Point Awards</Title>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Row gutter={24}>
                    <Col span={12}>
                        <DroppableContainer id="available-hooks" title="Available Hooks" description="Drag a hook to the right to activate it.">
                            <Select mode="tags" placeholder="Filter Hooks Type" style={{ width: '100%', margin: '16px 0' }} />
                            <SortableContext items={available.map(h => h.id)} strategy={verticalListSortingStrategy}>
                                {available.map(hook => <AvailableHook key={hook.id} id={hook.id} title={hook.label} description="Default Description" />)}
                            </SortableContext>
                        </DroppableContainer>
                    </Col>
                    <Col span={12}>
                        <DroppableContainer id="active-hooks" title="Active Hooks" description="The following hooks will award points to users.">
                            <SortableContext items={active.map(h => h.id)} strategy={verticalListSortingStrategy}>
                                {active.map(hook =>
                                    <ActiveHook
                                        key={hook.id}
                                        id={hook.id}
                                        title={hook.label}
                                        points={hook.points}
                                        onPointsChange={handlePointsChange}
                                        onRemove={handleRemoveActive}
                                    />
                                )}
                            </SortableContext>
                        </DroppableContainer>
                    </Col>
                </Row>
            </DndContext>
        </Card>
    );
};

export default AutomaticAwards;