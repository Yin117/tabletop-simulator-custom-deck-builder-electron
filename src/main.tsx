import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';

const rootElm = document.getElementById('root');
if (rootElm) {
  const root = createRoot(rootElm);
  root.render(
    <StrictMode>
      <HashRouter>
        <App/>
      </HashRouter>
    </StrictMode>
  );
} else {
  console.log('Root Elm is missing');
}