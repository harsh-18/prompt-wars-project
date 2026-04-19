import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SimulationProvider, useSimulation, STADIUM_NODES } from './SimulationContext';

// Dummy component to test context values
const TestComponent = () => {
  const { nodesData, isSurgeActive, toggleSurge } = useSimulation();
  
  return (
    <div>
      <div data-testid="surge-status">{isSurgeActive ? 'Active' : 'Inactive'}</div>
      <button data-testid="surge-btn" onClick={toggleSurge}>Toggle</button>
      <div data-testid="node-count">{Object.keys(nodesData).length}</div>
    </div>
  );
};

describe('SimulationContext', () => {
  it('renders children without crashing', () => {
    const { getByText } = render(
      <SimulationProvider>
        <div>Test Child</div>
      </SimulationProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes nodesData with all stadium nodes', () => {
    const { getByTestId } = render(
      <SimulationProvider>
        <TestComponent />
      </SimulationProvider>
    );
    expect(getByTestId('node-count')).toHaveTextContent(STADIUM_NODES.length.toString());
  });

  it('toggles isSurgeActive when toggleSurge is called', () => {
    const { getByTestId } = render(
      <SimulationProvider>
        <TestComponent />
      </SimulationProvider>
    );
    const status = getByTestId('surge-status');
    const btn = getByTestId('surge-btn');
    
    expect(status).toHaveTextContent('Inactive');
    
    act(() => {
      btn.click();
    });
    
    expect(status).toHaveTextContent('Active');
  });
});
