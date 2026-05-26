const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT } // Опциональное поле
});

module.exports = Item;
