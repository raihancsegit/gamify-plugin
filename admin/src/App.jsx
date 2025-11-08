import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import PointsSystem from './pages/PointsSystem'; // Import new page
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import { ConfigProvider } from 'antd';
import './App.css';

function App() {
  // This component will decide which page to show based on the URL query parameter
  // This makes our React Router sync with WordPress's menu slugs.
  const RouterManager = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');

    switch (page) {
      case 'gamify-points':
        return <PointsSystem />;
      case 'gamify-logs':
        return <Logs />;
      case 'gamify-settings':
        return <Settings />;
      case 'gamify':
      default:
        return <Dashboard />;
    }
  }

  return (
    <ConfigProvider prefixCls="gamify-ant">
      <div className="gamify-admin-wrapper">
        <main className="gamify-main-content">
          <RouterManager />
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;