import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import { register } from 'swiper/element/bundle'

import { ConfigProvider } from 'antd';

register();

const extensionRoot = document.createElement("div")
extensionRoot.id = "folders-chrome-extension"
document.body.appendChild(extensionRoot);

const root = ReactDOM.createRoot(extensionRoot);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
      },
      components: {
        Tree: {
          directoryNodeSelectedBg: '',
          motionDurationSlow: '0.05s',
          motionDurationMid: '0.05s',
          motionDurationFast: '0.05s',
        },
      },
    }}>
      <App />
    </ConfigProvider>
  </React.StrictMode >
);
