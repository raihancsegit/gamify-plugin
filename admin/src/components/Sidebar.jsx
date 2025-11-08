import React from 'react';
// We'll use NavLink to style the active link
import { NavLink } from 'react-router-dom';

// Helper function to create WordPress admin URLs
const getAdminPageUrl = (page) => {
    return `admin.php?page=${page}`;
};

const Sidebar = () => {
    return (
        <div className="gamify-sidebar">
            {/* This sidebar is just for visual representation in React. 
                 The actual menu is rendered by PHP. 
                 We will hide this later and use WordPress's own menu.
                 For now, it helps in development. */}
            <h2>Gamify Menu</h2>
            <ul>
                <li><NavLink to="/">Dashboard</NavLink></li>
                <li><NavLink to="/points">Points System</NavLink></li>
                <li><NavLink to="/logs">Logs</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
            </ul>
        </div>
    );
};

export default Sidebar;