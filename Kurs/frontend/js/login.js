// login.js
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
}).then(res => res.json())
  .then(data => {
    localStorage.setItem('userId', data.id);
    window.location.href = '/my-class.html';
  });
