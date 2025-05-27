const express = require('express');
const path = require('path');
const session = require('express-session'); 
const app = express();
const port = 3004;

const db = require('./initDB');

if (typeof db.initDB === 'function') {
  db.initDB();
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'super-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

const lessonsRouter = require('./routes/lessons');
app.use('/', lessonsRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
