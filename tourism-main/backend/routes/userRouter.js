const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require("../middleware/auth");

const userRouter = express.Router();

// Регистрация
userRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        });

        user.generateToken();
        await user.save();

        return res.send({ message: 'Ok', user });
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }

        next(e);
    }
});

// Логин с email и паролем
userRouter.post('/sessions', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(422).send({ error: 'Email not found!' });
        }

        const isMatch = await user.checkPassword(password);

        if (!isMatch) {
            return res.status(422).send({ error: 'Password is wrong!' });
        }

        user.generateToken();
        await user.save();

        return res.send({ message: 'Email and password are correct!', user });
    } catch (e) {
        next(e);
    }
});


// Пример защищенного маршрута
userRouter.get('/secret', auth, async (req, res, next) => {
    try {
        return res.send({
            message: 'Secret message',
            email: req.user?.email,
        });
    } catch (e) {
        next(e);
    }
});

userRouter.get('/', auth, async (req, res, next) => {
    try {
        return res.send({
            message: 'Secret message',
            email: req.user?.email,
        });
    } catch (e) {
        next(e);
    }
});

// Выход (logout)
userRouter.delete('/sessions', async (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');
        const successMessage = { message: 'Success!' };

        if (!headerValue) {
            return res.send(successMessage);
        }

        const [_bearer, token] = headerValue.split(' ');

        if (!token) {
            return res.send(successMessage);
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.send(successMessage);
        }

        user.generateToken();
        await user.save();

        return res.send(successMessage);
    } catch (e) {
        next(e);
    }
});

module.exports = userRouter;
