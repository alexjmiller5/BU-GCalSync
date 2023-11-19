// content.js
function checkForElement() {
    console.log("element is being checked")
    // Get the second table element on the page
    const tables = document.querySelectorAll('table');
    if (tables.length < 2) {
        return false; // Ensure there is a second table
    }
    const secondTable = tables[3];

    // console.log(secondTable)

    // // Get all font elements within the second table
    const tds = secondTable.querySelectorAll('td');

    if (!tds || tds.length !== 2)
     {
        return false
     }

    for (var i = 0; i < tds.length; i++) {
        // Check if the 'td' element contains the 'CURRENT SCHEDULE' text
        if(!tds[i] || !tds[i].innerText) {
            return false;
        }
        if (tds[i].innerText.includes('CURRENT SCHEDULE')) {
            // Found the 'CURRENT SCHEDULE' text, handle accordingly
            console.log('Found CURRENT SCHEDULE in a td element:', tds[i]);
            
            // If you need to send this information back to your background script
            chrome.runtime.sendMessage({elementFound: true});
            return true; // Or any other appropriate action
        }
    }

    return false;
}

chrome.runtime.sendMessage({ elementFound: checkForElement() });