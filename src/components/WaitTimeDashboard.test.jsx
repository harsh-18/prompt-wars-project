import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WaitTimeDashboard } from './WaitTimeDashboard';

// Mock the SimulationContext
vi.mock('../engine/SimulationContext', () => ({
  useSimulation: () => ({
    nodesData: {
      'C1': { density: 60, predictedWait: 8 },
      'R1': { density: 20, predictedWait: 2 }
    }
  }),
  STADIUM_NODES: [
    { id: 'C1', type: 'concession', name: 'North Grill' },
    { id: 'R1', type: 'restroom', name: 'Restroom North' }
  ]
}));

describe('WaitTimeDashboard', () => {
  it('renders concession section header', () => {
    const { getByText } = render(<WaitTimeDashboard />);
    expect(getByText('CONCESSIONS')).toBeInTheDocument();
    expect(getByText('North Grill')).toBeInTheDocument();
  });

  it('renders restroom section header', () => {
    const { getByText } = render(<WaitTimeDashboard />);
    expect(getByText('RESTROOMS')).toBeInTheDocument();
    expect(getByText('Restroom North')).toBeInTheDocument();
  });

  it('displays correct wait time values from mocked density', () => {
    const { getByText } = render(<WaitTimeDashboard />);
    expect(getByText('8 min')).toBeInTheDocument();
    expect(getByText('2 min')).toBeInTheDocument();
    expect(getByText('Crowd: 60%')).toBeInTheDocument();
    expect(getByText('Crowd: 20%')).toBeInTheDocument();
  });
});
