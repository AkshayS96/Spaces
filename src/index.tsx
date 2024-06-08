import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react";
import { popoverTheme } from './theme/Popover';


export const theme = extendTheme({
  components: { Popover: popoverTheme }
});

const extensionRoot = document.createElement("div")
extensionRoot.id = "folders-chrome-extension"
document.body.appendChild(extensionRoot);

const root = ReactDOM.createRoot(extensionRoot);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
