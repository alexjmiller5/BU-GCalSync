// Implement the service worker to check if the user is already authenticated on opening the extension
// chrome.runtime.onInstalled.addListener(() => {
//     // Perform initial setup and check for an existing token
//     chrome.identity.getAuthToken({ interactive: false }, function (token) {
//         if (chrome.runtime.lastError || !token) {
//             // Not authenticated or an error occurred, set popup to OAuth
//             chrome.action.setPopup({ popup: 'popup/popup.html' });
//         } else {
//             // Authenticated, set popup to parser
//             chrome.action.setPopup({ popup: 'popup/studentLink.html' });
//         }
//     });
// });

// Function to update the icon and popup based on URL
function updateIconAndPopup(tabId, url) {
    if (url && url.includes("ModuleName=allsched.pl")) {
        console.log(url, "is correct");
        // Set icon to calendar-modified when URL is correct
        chrome.action.setIcon({ path: "images/calendar.png", tabId: tabId });
        // Set popup to parser
        chrome.action.setPopup({ popup: 'popup/parser.html' });
    } else {
        console.log(url, "is not correct");
        // Set icon to default when URL is not correct
        chrome.action.setIcon({ path: "images/calendar-modified.png", tabId: tabId });
        // Set popup to default
        chrome.action.setPopup({ popup: 'popup/studentLink.html' });
    }
}

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        updateIconAndPopup(activeInfo.tabId, tab.url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab URL is updated
    if (changeInfo.url) {
        updateIconAndPopup(tabId, changeInfo.url);
    }
});