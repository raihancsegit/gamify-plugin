import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PointTypesTable from '../components/points/PointTypesTable'; // The table view
import TriggerSettings from '../components/points/TriggerSettings'; // The settings view
import { setView, setSelectedPointType } from '../store/features/pointTypesSlice';

const PointsSystem = () => {
    const dispatch = useDispatch();
    const { view, selectedPointType } = useSelector((state) => state.pointTypes);

    // This function will be passed to the settings page to handle going back
    const showTableView = () => {
        dispatch(setSelectedPointType(null)); // Clear the selected ID
        dispatch(setView('table'));
    };

    return (
        <div>
            {view === 'table' ? (
                <PointTypesTable />
            ) : (
                <TriggerSettings
                    pointTypeId={selectedPointType}
                    onBack={showTableView}
                />
            )}
        </div>
    );
};

export default PointsSystem;