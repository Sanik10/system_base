const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJwt = (id, login, role) => {
    return jwt.sign({ id, login, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

class AuthController {
    async register(req, res) {
        const { login, password, fullName, phone, email } = req.body;
        // Проверка уникальности
        const candidate = await User.findOne({ where: { login } });
        if (candidate) return res.status(400).json({ message: "Логин занят" });

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ login, password: hashPassword, fullName, phone, email, role: 'USER' });
        
        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token, role: user.role });
    }

    async login(req, res) {
        const { login, password } = req.body;

        // ХАРДКОД АДМИНА
        if (login === 'Admin' && password === 'Admin') {
            let admin = await User.findOne({ where: { login } });
            if (!admin) {
                const hashPassword = await bcrypt.hash(password, 5);
                admin = await User.create({ login, password: hashPassword, fullName: 'Админ', phone: '-', email: '-', role: 'ADMIN' });
            }
            const token = generateJwt(admin.id, admin.login, admin.role);
            return res.json({ token, role: admin.role });
        }

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) return res.status(400).json({ message: "Неверный пароль" });

        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token, role: user.role });
    }
}
module.exports = new AuthController();
