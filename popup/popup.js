document.getElementById('google-sign-in-btn').addEventListener('click', function () {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
      document.getElementById('status-message').textContent = 'Sign in failed. Please try again.';
      console.log(chrome.runtime.lastError);
    } else {
      // Use the token for your API calls; we'll validate the token in the background script
      document.getElementById('status-message').textContent = 'Sign in successful!';

      // Change to the parser window
      window.location.href = "parser.html";

    }
  });
});
