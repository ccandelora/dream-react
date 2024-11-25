import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from '../context/SupabaseProvider';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <SupabaseProvider>
        {ui}
      </SupabaseProvider>
    </BrowserRouter>
  );
}