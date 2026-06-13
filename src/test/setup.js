import '@testing-library/jest-dom';

// Recharts' ResponsiveContainer relies on ResizeObserver, absent in jsdom.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserver;
