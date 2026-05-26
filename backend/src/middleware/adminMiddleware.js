module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Доступ запрещен. Только для администратора." });
        }
        next();
    } catch (e) {
        res.status(401).json({ message: "Не авторизован" });
    }
};
