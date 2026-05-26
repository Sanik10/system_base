const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sequelize = require('./config/db');
const { User, Booking, Review } = require('./models/models');

const app = express();
app.use(cors());
app.use(express.json());

const router = require('./routes/index');
app.use('/api', router);

// Функция инициализации Админа
async function initAdmin() {
    try {
        const hashPassword = await bcrypt.hash('Demo20', 5);
        const [admin, created] = await User.findOrCreate({
            where: { login: 'Admin26' },
            defaults: {
                password: hashPassword,
                full_name: 'Администратор',
                phone: '+70000000000',
                email: 'admin@banketam.net',
                role: 'ADMIN'
            }
        });
        if (created) {
            console.log('Учетная запись Админа (Admin26/Demo20) успешно создана!');
        }
    } catch (err) {
        console.error('Ошибка при создании админа:', err);
    }
}

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate(); // Проверка подключения
        await sequelize.sync({ alter: true }); // Авто-создание и обновление таблиц
        console.log('База данных подключена и синхронизирована.');
        
        app.listen(PORT, async () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            await initAdmin();
        });
    } catch (e) {
        console.log('Ошибка при запуске сервера:', e);
    }
};

start();
