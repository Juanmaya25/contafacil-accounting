import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App.jsx';

afterEach(cleanup);

describe('ContaFácil App', () => {
  it('renders the brand and the financial summary heading', () => {
    render(<App />);
    expect(screen.getByText('ContaFácil')).toBeInTheDocument();
    expect(screen.getByText('Resumen financiero')).toBeInTheDocument();
  });

  it('navigates to the Transactions tab and lists seeded records', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Transacciones' }));
    expect(screen.getByText('Nómina empleados - Abril')).toBeInTheDocument();
  });

  it('shows the Facturación page with seeded invoices', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Facturación' }));
    expect(screen.getByText('Empresa ABC S.A.S')).toBeInTheDocument();
    expect(screen.getByText('FAC-2026-041')).toBeInTheDocument();
  });

  it('toggles dark mode via the theme button', () => {
    const { container } = render(<App />);
    const root = container.firstChild;
    const before = root.style.background;
    fireEvent.click(screen.getByRole('button', { name: 'Tema' }));
    const after = root.style.background;
    expect(before).not.toBe(after);
  });
});
