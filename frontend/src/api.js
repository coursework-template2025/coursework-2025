const API = '/api';

/* ===== AUTH ===== */

export function register(email, password) {
  return fetch(API + '/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());
}

export function login(email, password) {
  return fetch(API + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());
}

/* ===== NOTES ===== */

export function getNotes() {
  return fetch(API + '/notes', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }).then(r => r.json());
}

export function addNote(title, content) {
  return fetch(API + '/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ title, content })
  });
}

export function deleteNote(id) {
  return fetch(API + '/notes/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
}
