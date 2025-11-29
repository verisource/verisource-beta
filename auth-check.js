// Authentication check - redirects to login if not authenticated
(function() {
  const AUTH_KEY = 'verisource_auth';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  const isLoginPage = window.location.pathname.includes('login.html');
  
  if (!isLoginPage) {
    const auth = localStorage.getItem(AUTH_KEY);
    
    if (!auth) {
      window.location.href = 'login.html';
      return;
    }
    
    try {
      const authData = JSON.parse(auth);
      const isExpired = Date.now() - authData.timestamp > SESSION_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = 'login.html';
    }
  }
})();
