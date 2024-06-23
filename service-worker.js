
// Allows users to open the side panel by click on context menu item on the action toolbar icon
chrome.runtime.onInstalled.addListener(() => {
    //TODO: Create a multi menu item based context menu for all folders to directly save into folder
    chrome.contextMenus.create({
        id: 'saveToSpaces',
        title: 'Save to Spaces',
        contexts: ['all']
    });
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
    if (command === "toggle-extension-panel") {
        chrome.sidePanel.open({ windowId: tab.windowId });
        const result = await chrome.storage.local.get("sidePanelState");
        if (result && result.sidePanelState === "OPEN") {
            chrome.storage.local.set({ "sidePanelState": "CLOSE" });
        } else {
            chrome.storage.local.set({ "sidePanelState": "OPEN" });
        }
    }
});