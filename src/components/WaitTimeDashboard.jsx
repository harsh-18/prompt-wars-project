import React from 'react';
import { useSimulation, STADIUM_NODES } from '../engine/SimulationContext';
import { Clock, Users, Flame, Info } from 'lucide-react';

export const WaitTimeDashboard = () => {
  const { nodesData } = useSimulation();
  
  const concessions = STADIUM_NODES.filter(n => n.type === 'concession');
  const restrooms = STADIUM_NODES.filter(n => n.type === 'restroom');

  const renderItem = (node) => {
    const data = nodesData[node.id] || { density: 10, predictedWait: 0 };
    
    let statusClass = 'text-status-green';
    let progressBg = '#10b981';
    if (data.density > 80) {
      statusClass = 'text-status-red';
      progressBg = '#ef4444';
    } else if (data.density > 50) {
      statusClass = 'text-status-yellow';
      progressBg = '#f59e0b';
    }

    return (
      <div key={node.id} className="flex-col gap-2" style={{ marginBottom: '1rem' }}>
        <div className="flex-row justify-between items-center">
          <span className="font-bold">{node.name}</span>
          <span className={`font-bold ${statusClass}`} style={{ color: progressBg }}>
            {data.predictedWait} min
          </span>
        </div>
        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${data.density}%`, 
              backgroundColor: progressBg, 
              transition: 'width 0.5s ease' 
            }} 
          />
        </div>
        <div className="flex-row justify-between text-xs text-muted">
          <span>Crowd: {data.density}%</span>
          {data.density > 80 && <span style={{ color: '#ef4444' }} className="flex-row items-center gap-2"><Flame size={12}/> Surging</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ width: '350px', height: '100%', overflowY: 'auto' }}>
      <div className="flex-row items-center justify-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="text-xl font-bold flex-row items-center gap-2">
          <Clock size={20} /> AI Predictions
        </h2>
        <span className="text-xs flex-row items-center gap-2" style={{ color: '#6366f1', background: 'rgba(99,102,241,0.2)', padding: '4px 8px', borderRadius: '12px' }}>
          Vertex AI Active
        </span>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 className="text-sm font-bold text-muted flex-row items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Users size={16} /> CONCESSIONS
        </h3>
        {concessions.map(renderItem)}
      </div>

      <div>
        <h3 className="text-sm font-bold text-muted flex-row items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Info size={16} /> RESTROOMS
        </h3>
        {restrooms.map(renderItem)}
      </div>
    </div>
  );
};
