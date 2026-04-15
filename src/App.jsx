import React, { useState } from 'react';
import { SimulationProvider } from './engine/SimulationContext';
import { WaitTimeDashboard } from './components/WaitTimeDashboard';
import { StadiumMap } from './components/StadiumMap';
import { NavigationControls } from './components/NavigationControls';

const AppContent = () => {
  const [startNode, setStartNode] = useState('S1');
  const [endNode, setEndNode] = useState('C3');

  return (
    <div className="flex-col" style={{ minHeight: '100vh', padding: '2rem', overflowX: 'hidden' }}>
      
      {/* Header */}
      <header className="flex-row items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div className="flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#fff', letterSpacing: '-0.5px' }}>
              AeroFlow <span style={{ color: '#6366f1' }}>Intelligence</span>
            </h1>
            <p className="text-sm text-muted">Hack2Skill Prompt Wars • Dynamic Crowd Optimization MVP</p>
          </div>
          <div className="flex-col" style={{ alignItems: 'flex-end' }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              Built by Harsh Verma
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-col" style={{ flex: 1, gap: '1.5rem', minHeight: 0 }}>
        
        {/* Top bar controls */}
        <NavigationControls 
          startNode={startNode} setStartNode={setStartNode}
          endNode={endNode} setEndNode={setEndNode}
        />

        {/* Content Split */}
        <div className="flex-row gap-6" style={{ flex: 1, flexWrap: 'wrap' }}>
          
          {/* Main Visualizer */}
          <StadiumMap startNode={startNode} endNode={endNode} />

          {/* AI Metrics Sidebar */}
          <WaitTimeDashboard />
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
