import { STADIUM_NODES } from './SimulationContext';

// Define the edges (connections) between the nodes
export const EDGES = [
  { from: 'S1', to: 'N1', distance: 10 },
  { from: 'S2', to: 'N2', distance: 10 },
  { from: 'S3', to: 'N3', distance: 20 },
  { from: 'S4', to: 'N3', distance: 20 },
  { from: 'N1', to: 'N2', distance: 20 },
  { from: 'N1', to: 'C1', distance: 10 },
  { from: 'N1', to: 'R1', distance: 15 },
  { from: 'N2', to: 'C2', distance: 10 },
  { from: 'N2', to: 'R2', distance: 15 },
  { from: 'N3', to: 'C3', distance: 5 },
  { from: 'N1', to: 'C3', distance: 40 }, // cross-stadium route
  { from: 'N2', to: 'C3', distance: 40 }, // cross-stadium route
];

// Helper to make it undirected
const getAdjacencyList = () => {
  const adj = {};
  STADIUM_NODES.forEach(n => adj[n.id] = []);
  EDGES.forEach(e => {
    adj[e.from].push({ to: e.to, distance: e.distance });
    adj[e.to].push({ to: e.from, distance: e.distance });
  });
  return adj;
};

/**
 * Calculates the best path avoiding congested nodes.
 * @param {string} startId 
 * @param {string} endId 
 * @param {object} nodesData The real-time ML density mapping
 */
export const calculateOptimalPath = (startId, endId, nodesData) => {
  if (!startId || !endId) return [];
  
  const adj = getAdjacencyList();
  const distances = {};
  const previous = {};
  const unvisited = new Set(STADIUM_NODES.map(n => n.id));
  
  STADIUM_NODES.forEach(n => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
  });
  
  distances[startId] = 0;
  
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let minNode = null;
    unvisited.forEach(node => {
      if (!minNode || distances[node] < distances[minNode]) {
        minNode = node;
      }
    });

    if (distances[minNode] === Infinity) break;
    if (minNode === endId) break;
    
    unvisited.delete(minNode);
    
    adj[minNode].forEach(neighbor => {
      if (unvisited.has(neighbor.to)) {
        // DYNAMIC CONGESTION WEIGHTING (The secret sauce of our MVP)
        // We look at the crowd density of the target node and exponentially penalize it
        const targetDensity = (nodesData[neighbor.to] && nodesData[neighbor.to].density) || 10;
        
        let multiplier = 1;
        if (targetDensity > 80) multiplier = 5.0; // Avoid red zones aggressively
        else if (targetDensity > 60) multiplier = 2.0;

        const alt = distances[minNode] + (neighbor.distance * multiplier);
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = minNode;
        }
      }
    });
  }
  
  const path = [];
  let curr = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // If path length is 1, it means we couldn't reach it
  if (path.length === 1 && path[0] !== startId) return [];
  
  return path;
};
