const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require("./routes/userRouter");
const tourismRouter = require("./routes/tourismRouter");
const configObj = require("./config/config");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());


// Маршруты
app.use('/api/users', userRouter);
app.use('/api/tourism', tourismRouter);

const run = async () => {
    await mongoose.connect(configObj.mongoose.db);

    app.listen(PORT, () => {
        console.log(`Server started on ${PORT} port!`);
    });
    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();