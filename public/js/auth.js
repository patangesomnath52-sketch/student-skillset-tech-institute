// Global auth state observer – runs on every page
auth.onAuthStateChanged(user => {
  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');
  const dashboardLink = document.querySelector('a[href="student-dashboard.html"]');

  if (user) {
    // User is signed in
    if (loginLink) {
      loginLink.href = 'student-dashboard.html';
      loginLink.textContent = 'My Dashboard';
      loginLink.removeAttribute('href'); // remove login link behavior
      loginLink.setAttribute('href', 'student-dashboard.html');
    }
    if (signupLink) {
      signupLink.style.display = 'none';  // hide sign up when logged in
    }
    if (dashboardLink) {
      dashboardLink.style.display = 'inline-block';
    }
  } else {
    // User is signed out
    if (loginLink) {
      loginLink.href = 'login.html';
      loginLink.textContent = 'Student Login';
    }
    if (signupLink) {
      signupLink.style.display = 'inline-block';
    }
    if (dashboardLink) {
      dashboardLink.style.display = 'none';
    }
  }
});