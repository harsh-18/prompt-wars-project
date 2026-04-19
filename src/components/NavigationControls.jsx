import React from 'react';
import { useSimulation, STADIUM_NODES } from '../engine/SimulationContext';
import { Route, MapPin, Search, AlertTriangle } from 'lucide-react';

export const NavigationControls = ({ startNode, endNode, setStartNode, setEndNode }) => {
  const { toggleSurge, isSurgeActive } = useSimulation();

  const sections = STADIUM_NODES.filter(n => n.type === 'section');
  const destinations = STADIUM_NODES.filter(n => n.type === 'concession' || n.type === 'restroom');

  return (
    <div className="glass-panel flex-row items-center justify-between" style={{ padding: '1rem 2rem', marginBottom: '1.5rem' }}>
      
      <div className="flex-row items-center gap-6">
        {/* Start Select */}
        <div className="flex-col gap-2">
          <label htmlFor="startNodeSelect" className="text-xs text-muted font-bold flex-row items-center gap-2">
            <MapPin size={14} /> CURRENT LOCATION (SECTION)
          </label>
          <select 
            id="startNodeSelect"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* End Select */}
        <div className="flex-col gap-2">
          <label htmlFor="endNodeSelect" className="text-xs text-muted font-bold flex-row items-center gap-2">
            <Search size={14} /> DESTINATION
          </label>
          <select 
            id="endNodeSelect"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.type})</option>)}
          </select>
        </div>

      </div>

      <div className="flex-row items-center gap-4">
        {/* Force Surge Trigger to Demo Path Rerouting */}
        <button 
          onClick={toggleSurge}
          aria-pressed={isSurgeActive}
          aria-describedby="surge-desc"
          style={{
            background: isSurgeActive ? '#ef4444' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: isSurgeActive ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          <AlertTriangle size={18} />
          {isSurgeActive ? 'HALFTIME SURGE ACTIVE' : 'Simulate Halftime Surge'}
        </button>
        <span id="surge-desc" style={{ display: 'none' }}>Simulates a rapid increase in crowd density to show AI rerouting</span>
      </div>

    </div>
  );
};
