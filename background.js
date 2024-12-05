chrome.runtime.onInstalled.addListener(() => {
    console.log("Tab Manager Extension Installed!");
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "get-tabs") {
        chrome.tabs.query({}, (tabs) => {
            sendResponse({ tabs });
        });
        return true; // Keeps the message channel open
    }
});

// Open the popup when the shortcut is pressed
chrome.commands.onCommand.addListener((command) => {
    if (command === "open-extension") {
        chrome.action.openPopup();
    }
});
