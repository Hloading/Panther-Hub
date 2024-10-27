// Toggle between Login and Register forms
document.getElementById('show-register').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default anchor behavior
  document.getElementById('login-form').style.display = 'none';  // Hide login form
  document.getElementById('register-form').style.display = 'block';  // Show register form
});

document.getElementById('show-login').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default anchor behavior
  document.getElementById('register-form').style.display = 'none';  // Hide register form
  document.getElementById('login-form').style.display = 'block';  // Show login form
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simple validation
  if (!email || !password) {
    alert('Please fill out both fields.');
    return;
  }

  // Simulate sending login data to the backend (API request)
  // Example: Replace with actual backend API endpoint
  fetch('http://example.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Login successful!');
      // Redirect user to the events page (or any other page)
      window.location.href = 'events.html';
    } else {
      alert('Invalid email or password');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error logging in. Please try again later.');
  });
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Simple validation
  if (!name || !email || !password) {
    alert('Please fill out all fields.');
    return;
  }

  // Simulate sending registration data to the backend (API request)
  // Example: Replace with actual backend API endpoint
  fetch('http://example.com/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Registration successful! You can now log in.');
      // Switch back to the login form after successful registration
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    } else {
      alert('There was a problem with registration.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error registering. Please try again later.');
  });
});
