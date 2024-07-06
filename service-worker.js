
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({ title: "Save to Spaces", id: "saveToSpaces" });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveToSpaces") {
        chrome.storage.local.get('spaces-current-space', (items) => {
            if (items["spaces-current-space"]) {
                console.log(items);
                chrome.storage.local.get(`spaces-extension-space-${items["spaces-current-space"]}`, (spaceDataItems) => {
                    const spaceData = spaceDataItems[`spaces-extension-space-${items["spaces-current-space"]}`];
                    console.log(spaceDataItems);
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
                                    [`spaces-extension-space-${items["spaces-current-space"]}`]: spaceData,
                                });
                            }
                        });
                    }
                });
            }
        });
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
        case "space-1":
        case "space-2":
        case "space-3":
        case "space-4":
        case "space-5":
        case "space-6":
        case "space-7":
        case "space-8":
        case "space-9": {
            const spaceId = command.split("-")[1];
            if (spaceId) {
                console.log(spaceId);
            }
            break;
        }
    }
});