const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") return next();
    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({message: "Не авторизован"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Добавляем данные юзера (id, role, login) в объект запроса
        next();
    } catch (e) {
        res.status(401).json({message: "Не авторизован"});
    }
};
