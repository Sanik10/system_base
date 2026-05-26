const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Application = sequelize.define('application', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room: { type: DataTypes.STRING, allowNull: false }, // Аудитория, коворкинг...
    date: { type: DataTypes.STRING, allowNull: false }, // Дата начала
    paymentMethod: { type: DataTypes.STRING, allowNull: false }, // Способ оплаты
    status: { type: DataTypes.STRING, defaultValue: 'Новая' }, // Новая, Мероприятие назначено...
    review: { type: DataTypes.TEXT } // Для отзыва
});

module.exports = Application;
