import React from 'react';
import './ConnectionStatus.css';

function ConnectionStatus({ isConnected, lastUpdate }) {
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>
      {lastUpdate && isConnected && (
        <span className="update-time">Last update: {lastUpdate}</span>
      )}
    </div>
  );
}

export default ConnectionStatus;

