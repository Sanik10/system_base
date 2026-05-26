const User = require('./User');
const Application = require('./Application');

User.hasMany(Application);
Application.belongsTo(User);

module.exports = { User, Application };
