function updateIconAndPopup(tabId, elementFound) {
    if (elementFound) {
        console.log("Element with specific word found");
        chrome.action.setIcon({ path: "images/calendar.png", tabId: tabId });
        chrome.action.setPopup({ popup: 'popup/parser.html' });
    } else {
        console.log("Element not found");
        chrome.action.setIcon({ path: "images/calendar-modified.png", tabId: tabId });
        chrome.action.setPopup({ popup: 'popup/studentLink.html' });
    }
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.elementFound !== undefined) {
        updateIconAndPopup(sender.tab.id, message.elementFound);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tab has been updated")
    if (changeInfo.url){// && tab.url && tab.url.includes("://www.bu.edu/link/bin/")) {
        if (tab.url && !tab.url.includes("chrome://")) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['scripts/content.js']
        });
    }
    }
});

// Added onActivated event listener
chrome.tabs.onActivated.addListener(activeInfo => {
    console.log("tab has been activated")
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        // Check if the activated tab's URL matches the specified pattern
        if (tab.url && !tab.url.includes("chrome://")) {
        // if (tab.url && tab.url.includes("://www.bu.edu/link/bin/")) {
            // Execute content script for the activated tab
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['scripts/content.js']
            });
        // }
        }
    });
});
