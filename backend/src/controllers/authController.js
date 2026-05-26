const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const generateJwt = (id, login, role) => {
    return jwt.sign({ id, login, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class AuthController {
    async register(req, res) {
        try {
            const { login, password, full_name, phone, email } = req.body;

            // Валидация
            const loginRegex = /^[a-zA-Z0-9]{6,}$/;
            if (!loginRegex.test(login)) {
                return res.status(400).json({ message: "Логин: от 6 символов, латиница и цифры" });
            }
            if (!password || password.length < 8) {
                return res.status(400).json({ message: "Пароль: минимум 8 символов" });
            }
            if (!full_name || !phone || !email) {
                return res.status(400).json({ message: "Все поля обязательны" });
            }

            // Проверка уникальности
            const candidate = await User.findOne({ where: { login } });
            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
            }

            // Хеширование и создание
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({
                login,
                password: hashPassword,
                full_name,
                phone,
                email
            });

            const token = generateJwt(user.id, user.login, user.role);
            res.status(201).json({ token, role: user.role });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Ошибка сервера при регистрации" });
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;

            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Неверный пароль" });
            }

            const token = generateJwt(user.id, user.login, user.role);
            res.json({ token, role: user.role });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Ошибка сервера при авторизации" });
        }
    }
}

module.exports = new AuthController();
