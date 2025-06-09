const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/entries', require('./routes/entries'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
