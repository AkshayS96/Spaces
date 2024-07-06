
chrome.runtime.onInstalled.addListener(async () => {
    // Add dynamic context menu here
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveToSpaces") {
        console.log(info);
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