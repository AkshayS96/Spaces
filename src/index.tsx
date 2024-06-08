import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import { ChakraProvider } from '@chakra-ui/react';

const extensionRoot = document.createElement("div")
extensionRoot.id = "folders-chrome-extension"
document.body.appendChild(extensionRoot);

const root = ReactDOM.createRoot(extensionRoot);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
