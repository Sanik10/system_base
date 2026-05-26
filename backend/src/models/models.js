const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Модель Пользователя
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
});

// Модель Заявки (Бронирование)
const Booking = sequelize.define('booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room_type: { type: DataTypes.STRING, allowNull: false }, // Зал, Ресторан и т.д.
    event_date: { type: DataTypes.DATEONLY, allowNull: false }, // Формат даты
    payment_method: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Новая' }
});

// Модель Отзыва
const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false }
});

// Настраиваем связи (Отношения)
// Один пользователь может иметь много заявок
User.hasMany(Booking);
Booking.belongsTo(User);

// Один пользователь может оставить много отзывов
User.hasMany(Review);
Review.belongsTo(User);

// Одна заявка может иметь отзывы (или один отзыв на заявку)
Booking.hasMany(Review);
Review.belongsTo(Booking);

module.exports = {
    User,
    Booking,
    Review
};
