// Add this script to the top of your main HTML pages
(function() {
  const AUTH_KEY = 'verisource_auth';
  const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  
  function isAuthenticated() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    
    const { timestamp } = JSON.parse(auth);
    const now = Date.now();
    
    if (now - timestamp > AUTH_EXPIRY) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    
    return true;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated() && !window.location.pathname.includes('login.html')) {
    window.location.href = './login.html';
  }
})();
