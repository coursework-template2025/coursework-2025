const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Проверяем, существует ли админ
        const admin = await User.findOne({ role: 'admin' });
        
        if (!admin) {
            // Создаем админа
            const adminUser = new User({
                username: 'admin',
                password: 'admin123', // Пароль будет автоматически захеширован
                role: 'admin'
            });

            await adminUser.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        // Выводим список всех пользователей
        const users = await User.find();
        console.log('\nAll users:');
        users.forEach(user => {
            console.log(`Username: ${user.username}, Role: ${user.role}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin(); 