// Implement the service worker to check if the user is already authenticated on opening the extension
chrome.runtime.onInstalled.addListener((activeInfo) => {
    // Perform initial setup and check for an existing token
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
        if (chrome.runtime.lastError || !token) {
            // Not authenticated or an error occurred, set popup to OAuth
            chrome.action.setPopup({ popup: 'popup/popup.html' });
        } else {
            // otherwise 
            chrome.tabs.get(activeInfo.tabId, function(tab) {
                if (tab.url && tab.url.includes("ModuleName=allsched.pl")) {
                    console.log(tab.url, "is correct");
                    // Set popup to parser
                    chrome.action.setPopup({ popup: 'popup/parser.html' });
                    // Set icon to calendar-modified when URL is correct
                    chrome.action.setIcon({ path: "images/calendar.png", tabId: activeInfo.tabId })
                } else {
                    console.log(tab.url, "is not correct");
                    // Set popup to default
                    chrome.action.setPopup({ popup: 'popup/studentLink.html' });
                    // Set icon to calendar-modified when URL is correct
                    chrome.action.setIcon({ path: "images/calendar-modified.png", tabId: activeInfo.tabId })
                }
            });
            // // Authenticated, set popup to parser
            // chrome.action.setPopup({ popup: 'popup/parser.html' });
        }
    });
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url && tab.url.includes("ModuleName=allsched.pl")) {
            console.log(tab.url, "is correct");
            // Set popup to parser
            chrome.action.setPopup({ popup: 'popup/parser.html' });
            // Set icon to calendar-modified when URL is correct
            chrome.action.setIcon({ path: "images/calendar.png", tabId: activeInfo.tabId })
        } else {
            console.log(tab.url, "is not correct");
            // Set popup to default
            chrome.action.setPopup({ popup: 'popup/studentLink.html' });
            // Set icon to calendar-modified when URL is correct
            chrome.action.setIcon({ path: "images/calendar-modified.png", tabId: activeInfo.tabId })
        }
    });
});


// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete') {
//         checkTabAndRunScript(tabId, tab.url);
//     }
// });

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//     chrome.tabs.get(activeInfo.tabId, function (tab) {
//         checkTabAndRunScript(activeInfo.tabId, tab.url);
//     });
// });

// function checkTabAndRunScript(tabId, url) {
//     // Check if the tab matches the conditions you want
//     if (url.includes("theConditionYouWantToCheck")) {
//         console.log('Tab is the studentlink site')
//     }
// }