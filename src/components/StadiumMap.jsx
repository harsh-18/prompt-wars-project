import React, { useState, useEffect } from 'react';
import { useSimulation, STADIUM_NODES } from '../engine/SimulationContext';
import { calculateOptimalPath, EDGES } from '../engine/Pathfinder';
import { getAIRecommendation } from '../engine/GeminiService';

export const StadiumMap = ({ startNode, endNode }) => {
  const { nodesData, isSurgeActive } = useSimulation();
  
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Calculate the path based on user selection and live density
  const optimalPath = calculateOptimalPath(startNode, endNode, nodesData);

  useEffect(() => {
    if (optimalPath.length > 0) {
      setAiLoading(true);
      getAIRecommendation(nodesData, optimalPath, startNode, endNode, isSurgeActive).then(res => {
        setAiRecommendation(res);
        setAiLoading(false);
      });
    }
  }, [startNode, endNode, isSurgeActive]);

  const getNodeColor = (id) => {
    const d = nodesData[id]?.density || 10;
    if (d > 80) return '#ef4444'; // Red
    if (d > 50) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  return (
    <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
      
      <div aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        Optimal route updated to nodes: {optimalPath.join(', ')}
      </div>

      {/* We use an SVG to draw the "Stadium Diagram" */}
      <svg width="100%" height="100%" viewBox="0 0 800 800" style={{ position: 'absolute', top: 0, left: 0 }} role="img" aria-label="Stadium crowd density map">
        <title>Stadium crowd density map</title>
        <desc>Visual map showing live crowd densities and the currently active path</desc>
        {/* Arena Name Branding */}
        <text x="400" y="400" transform="translate(0, 0)" textAnchor="middle" fill="rgba(255,255,255,0.05)" fontSize="80" fontWeight="bold" letterSpacing="10" style={{ pointerEvents: 'none' }}>
          AEROFLOW
        </text>
        <text x="400" y="480" transform="translate(0, 0)" textAnchor="middle" fill="rgba(255,255,255,0.03)" fontSize="60" fontWeight="bold" letterSpacing="25" style={{ pointerEvents: 'none' }}>
          ARENA
        </text>

        {/* Draw all static edges (corridors) */}
        {EDGES.map((edge, i) => {
          const n1 = STADIUM_NODES.find(n => n.id === edge.from);
          const n2 = STADIUM_NODES.find(n => n.id === edge.to);
          return (
            <line 
              key={`edge-${i}`} 
              x1={n1.x} y1={n1.y} 
              x2={n2.x} y2={n2.y} 
              stroke="rgba(255,255,255,0.1)" strokeWidth="4" 
            />
          );
        })}

        {/* Draw the optimally computed path */}
        {optimalPath.length > 1 && optimalPath.map((nodeId, index) => {
          if (index === optimalPath.length - 1) return null;
          const n1 = STADIUM_NODES.find(n => n.id === nodeId);
          const n2 = STADIUM_NODES.find(n => n.id === optimalPath[index + 1]);
          return (
            <line 
              key={`path-${index}`} 
              x1={n1.x} y1={n1.y} 
              x2={n2.x} y2={n2.y} 
              stroke="#6366f1" strokeWidth="8" 
              strokeLinecap="round"
              className="anim-pulse"
              style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.8))' }}
            />
          );
        })}

        {/* Draw all Nodes (Concessions, Restrooms, Corridors) */}
        {STADIUM_NODES.map((node) => {
          const isStart = node.id === startNode;
          const isEnd = node.id === endNode;
          const color = getNodeColor(node.id);
          const isCorridor = node.type === 'corridor';
          
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Heatmap Bloom Effect */}
              <circle r={isCorridor ? 20 : 35} fill={color} opacity="0.2" filter="blur(8px)" />
              
              <circle 
                r={isCorridor ? 8 : 15} 
                fill={color} 
                stroke={isStart || isEnd ? '#fff' : 'rgba(255,255,255,0.2)'} 
                strokeWidth={isStart || isEnd ? 3 : 1}
                role="img"
                aria-label={`${node.name}, density ${nodesData[node.id]?.density || 10}%`}
              />
              
              {!isCorridor && (
                <text 
                  y={30} 
                  textAnchor="middle" 
                  fill="#fff" 
                  fontSize="12" 
                  fontWeight={isStart || isEnd ? 'bold' : 'normal'}
                >
                  {node.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Overlay legend */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Congestion Legend</div>
        <div className="flex-row items-center gap-2" style={{ marginBottom: '4px' }}><div style={{ width: 12, height: 12, borderRadius: 6, background: '#ef4444'}}></div> High Density (&gt;80)</div>
        <div className="flex-row items-center gap-2" style={{ marginBottom: '4px' }}><div style={{ width: 12, height: 12, borderRadius: 6, background: '#f59e0b'}}></div> Moderate (&gt;50)</div>
        <div className="flex-row items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: 6, background: '#10b981'}}></div> Clear</div>
      </div>

      {/* AI Recommendation Overlay */}
      <div className="glass-panel" style={{ position: 'absolute', top: '20px', right: '20px', width: '320px', padding: '1rem', border: '1px solid rgba(99,102,241,0.5)' }}>
        <div className="flex-row items-center gap-2" style={{ marginBottom: '0.5rem', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ✨ AI Route Assistant
        </div>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#f8fafc' }} aria-live="polite">
          {aiLoading ? 'Analyzing...' : aiRecommendation}
        </div>
      </div>
    </div>
  );
};
