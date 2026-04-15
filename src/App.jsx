import React, { useState } from 'react';
import { SimulationProvider } from './engine/SimulationContext';
import { WaitTimeDashboard } from './components/WaitTimeDashboard';
import { StadiumMap } from './components/StadiumMap';
import { NavigationControls } from './components/NavigationControls';

const AppContent = () => {
  const [startNode, setStartNode] = useState('S1');
  const [endNode, setEndNode] = useState('C3');

  return (
    <div className="flex-col" style={{ height: '100vh', padding: '2rem', overflow: 'hidden' }}>
      
      {/* Header */}
      <header className="flex-row items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fff', letterSpacing: '-0.5px' }}>
            AeroFlow <span style={{ color: '#6366f1' }}>Intelligence</span>
          </h1>
          <p className="text-sm text-muted">Hack2Skill Prompt Wars • Dynamic Crowd Optimization MVP</p>
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
        <div className="flex-row gap-6" style={{ flex: 1, overflow: 'hidden' }}>
          
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
