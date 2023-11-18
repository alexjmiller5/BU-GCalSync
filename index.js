document.addEventListener('DOMContentLoaded', function() {
    // Get the button element by its ID
    var scrapeButton = document.getElementById('scrapeButton');

    // Add a click event listener to the button
    scrapeButton.addEventListener('click', function() {
        // Query the active tab in the current window
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // Send a message to the content script in the active tab
            console.log("found:")
            console.log(tabs)
            // chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeCourses"}, function(response) {
            //     // You can handle any response from the content script here
            //     // For example, if your content script sends back scraped data or a confirmation message
            //     console.log('Response from content script:', response);
            // });
        });
    }, false);
}, false);
console.log("hello world")