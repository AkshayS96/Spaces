function saveToSpace(spaceId) {
    chrome.storage.local.get(`spaces-extension-space-${spaceId}`, (spaceDataItems) => {
        const spaceData = spaceDataItems[`spaces-extension-space-${spaceId}`];
        if (spaceData) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs?.length) {
                    const tab = tabs[0];
                    spaceData.children.push({
                        id: Date.now().toString(),
                        name: tab.title ?? 'New Tab',
                        url: tab.url,
                        iconSrc: tab.favIconUrl,
                        type: 0,
                    });
                    chrome.storage.local.set({
                        [`spaces-extension-space-${spaceId}`]: spaceData,
                    });
                }
            });
        }
    });

}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.parentMenuItemId === "saveToSpaces") {
        const spaceId = info.menuItemId.split("-")[1];
        saveToSpace(spaceId);
    }
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// Allows users to open the side panel by using shortcut
chrome.commands.onCommand.addListener(async (command, tab) => {
    switch (command) {
        case "toggle-extension-panel": {
            chrome.sidePanel.open({ windowId: tab.windowId });
            const result = await chrome.storage.local.get("sidePanelState");
            if (result && result.sidePanelState === "OPEN") {
                chrome.storage.local.set({ "sidePanelState": "CLOSE" });
            } else {
                chrome.storage.local.set({ "sidePanelState": "OPEN" });
            }
            break;
        }
        case "add-current-tab": {
            chrome.storage.local.get('spaces-current-space', (items) => {
                if (items["spaces-current-space"]) {
                    saveToSpace(items["spaces-current-space"]);
                }
            });
        }
    }
});