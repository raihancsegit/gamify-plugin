import React from 'react';

const AutomaticPoints = () => {
    return (
        <div className="automatic-points-content">
            <div className="settings-box">
                <h3>Automatic Point Awards</h3>
                {/* Available Hooks Section */}
                <div className="hooks-container">
                    <div className="available-hooks">
                        <h4>Available Hooks</h4>
                        {/* Example Hook Item */}
                        <div className="hook-item">
                            <strong>Points for daily visits</strong>
                            <p>Award points for visiting your website on a daily basis.</p>
                        </div>
                        <div className="hook-item">
                            <strong>Points for Logins</strong>
                            <p>Award points for logging in.</p>
                        </div>
                    </div>
                    {/* Active Hooks Section */}
                    <div className="active-hooks">
                        <h4>Active Hooks</h4>
                        <div className="hook-item active">
                            <strong>Points for Logins</strong>
                            <p>Award points for logging in.</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="button-primary">Save Changes</button>
        </div>
    );
};

export default AutomaticPoints;