const User = require('./User');
const Item = require('./Item');

// ЗДЕСЬ ОПИСЫВАЮТСЯ СВЯЗИ (Relations). 
// Например, если один пользователь может создать много предметов:
User.hasMany(Item);
Item.belongsTo(User);

// Экспортируем все модели разом
module.exports = {
    User,
    Item
};
