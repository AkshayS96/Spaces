/*global chrome*/

import { useEffect, useState } from 'react';
import Spaces from './Spaces/Spaces';

function App() {
  const [appEnabled, setAppEnabled] = useState<boolean>(true);

  useEffect(() => {
    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      for (let [key, { newValue }] of Object.entries(changes)) {
        if (key === "sidePanelState" && newValue === "CLOSE") {
          setAppEnabled(false);
        }
      }
    };
    chrome.storage.local.onChanged.addListener(storageListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storageListener);
    }
  }, []);

  if (!appEnabled) {
    // Hack to support closing the extension using keyboard shortcut
    window.close();
  }

  return <Spaces />;
}

export default App;
