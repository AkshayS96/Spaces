import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import { register } from 'swiper/element/bundle'

import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

init({ data })

register();

const extensionRoot = document.createElement("div")
extensionRoot.id = "folders-chrome-extension"
document.body.appendChild(extensionRoot);

const root = ReactDOM.createRoot(extensionRoot);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode >
);
