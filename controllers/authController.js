const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJwt = (id, login, role) => {
    return jwt.sign({ id, login, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

class AuthController {
    // Вход (и заодно хардкод-создание админа при первой попытке)
    async login(req, res) {
        const { login, password } = req.body;

        // --- ХАРДКОД АДМИНА ---
        if (login === 'admin' && password === 'admin') {
            let admin = await User.findOne({ where: { login: 'admin' } });
            if (!admin) {
                const hashPassword = await bcrypt.hash('admin', 5);
                admin = await User.create({ login: 'admin', password: hashPassword, role: 'ADMIN' });
            }
            const token = generateJwt(admin.id, admin.login, admin.role);
            return res.json({ token });
        }
        // -----------------------

        // Обычный логин для БД
        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) return res.status(400).json({ message: "Указан неверный пароль" });

        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token });
    }
}

module.exports = new AuthController();
