document.getElementById('google-sign-in-btn').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError) {
        document.getElementById('status-message').textContent = 'Sign in failed. Please try again.';
        console.log(chrome.runtime.lastError);
      } else {
        // Use the token for your API calls; we'll validate the token in the background script
        document.getElementById('status-message').textContent = 'Sign in successful!';
        // You could call a function here that uses the token to interact with the Google Calendar API.
        console.log(token);

        // Dynamically load and display the "parser.html" content in the popup
        fetch(chrome.runtime.getURL('popup/parser.html'))
        .then(response => response.text())
        .then(html => {
          document.documentElement.innerHTML = html;
        });
      }
    });
  });