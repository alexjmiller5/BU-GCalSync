document.getElementById('google-sign-in-btn').addEventListener('click', function () {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
      document.getElementById('status-message').textContent = 'Sign in failed. Please try again.';
      console.log(chrome.runtime.lastError);
    } else {
      // Use the token for your API calls; we'll validate the token in the background script
      document.getElementById('status-message').textContent = 'Sign in successful!';


      // Save the token to chrome.storage

      // chrome.storage.local.set({ 'authToken': token }, function () {
      //   // Check for errors
      //   if (chrome.runtime.lastError) {
      //     console.log('Error setting token in chrome.storage:', chrome.runtime.lastError);
      //   } else {
      //     // Change to the parser window
          window.location.href = "parser.html";
      //   }
      // });
    }
  });
});
