import React, { createContext, useContext, useState, useEffect } from 'react';

// The Simulation Context mocks the real-time websocket feed from the Google Cloud / Vertex AI backend.
// It manages the density of different nodes (sections, gates, concessions) across the stadium.

export const STADIUM_NODES = [
  // Concessions
  { id: 'C1', type: 'concession', name: 'North Grill', baseWait: 5, x: 200, y: 100 },
  { id: 'C2', type: 'concession', name: 'South Drinks', baseWait: 2, x: 200, y: 700 },
  { id: 'C3', type: 'concession', name: 'East Snacks', baseWait: 3, x: 600, y: 400 },
  
  // Restrooms
  { id: 'R1', type: 'restroom', name: 'Restroom North', baseWait: 1, x: 300, y: 150 },
  { id: 'R2', type: 'restroom', name: 'Restroom South', baseWait: 1, x: 300, y: 650 },
  
  // Sections (Seating areas where people start)
  { id: 'S1', type: 'section', name: 'Section 101', x: 100, y: 300 },
  { id: 'S2', type: 'section', name: 'Section 102', x: 100, y: 500 },
  { id: 'S3', type: 'section', name: 'Section 103', x: 400, y: 200 },
  { id: 'S4', type: 'section', name: 'Section 104', x: 400, y: 600 },
  
  // Corridors / Intersections (routing nodes)
  { id: 'N1', type: 'corridor', name: 'Main Concourse NW', x: 200, y: 300 },
  { id: 'N2', type: 'corridor', name: 'Main Concourse SW', x: 200, y: 500 },
  { id: 'N3', type: 'corridor', name: 'East Gate Tunnel', x: 500, y: 400 },
];

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Store node states: { [nodeId]: { density: number (0-100), predictedWait: number } }
  const [nodesData, setNodesData] = useState({});
  const [isSurgeActive, setIsSurgeActive] = useState(false);

  // Initialize data
  useEffect(() => {
    const initialData = {};
    STADIUM_NODES.forEach(n => {
      initialData[n.id] = { density: 10, predictedWait: n.baseWait || 0 };
    });
    setNodesData(initialData);
  }, []);

  // The ML Engine Tick (Runs every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setNodesData(prev => {
        const newData = { ...prev };
        
        Object.keys(newData).forEach(id => {
          const nodeConf = STADIUM_NODES.find(n => n.id === id);
          
          // Random walk for dynamic simulation. Surges push densities much higher.
          const variance = Math.floor(Math.random() * 15) - 5; // -5 to +10
          let newDensity = newData[id].density + variance;
          
          // Halftime Surge Simulation
          if (isSurgeActive && nodeConf.type === 'concession') {
             newDensity += 20; 
          }
          
          if (newDensity < 5) newDensity = 5;
          if (newDensity > 100) newDensity = 100;
          
          // Vertex AI ML Model Mock: High density exponentially increases wait times
          let predictedWait = nodeConf.baseWait || 0;
          if (nodeConf.type === 'concession' || nodeConf.type === 'restroom') {
            if (newDensity > 80) predictedWait += (newDensity * 0.15);
            else if (newDensity > 50) predictedWait += (newDensity * 0.05);
            
            // Add some jitter to make it look "live"
            predictedWait += (Math.random() * 2 - 1);
            if(predictedWait < 0) predictedWait = 0;
          }

          newData[id] = { 
            density: Math.round(newDensity), 
            predictedWait: Math.max(0, Math.round(predictedWait * 10) / 10)
          };
        });
        
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isSurgeActive]);

  const toggleSurge = () => setIsSurgeActive(!isSurgeActive);

  return (
    <SimulationContext.Provider value={{ nodesData, isSurgeActive, toggleSurge }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
