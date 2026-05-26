require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const models = require('./models/index'); // Обязательно импортируем для создания таблиц
const router = require('./routes/index');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', router); // Все апишки будут начинаться с /api

const start = async () => {
    try {
        await sequelize.authenticate(); // Подключение к БД
        // СИНХРОНИЗАЦИЯ С БД. { alter: true } обновит таблицы, если ты изменишь модели
        await sequelize.sync({ alter: true }); 
        
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log("ОШИБКА ПРИ ЗАПУСКЕ:", e);
    }
}

start();
