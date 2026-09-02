import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/globals.css';
import { EigenfacesDemo } from '@/components/eigenfaces-demo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EigenfacesDemo />
  </StrictMode>,
);
