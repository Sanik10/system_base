Это абсолютно правильный подход. На экзамене тебе нужна "шпаргалка-трансформер", которую можно за 10 минут адаптировать под бронь отелей, запись к врачу, заказ пиццы или ремонт машин. 

Я собрал **УЛЬТИМАТИВНЫЙ ТУТОРИАЛ v2.0**, который учитывает роли (Админ/Юзер), регистрацию, валидацию и фронтенд-монолит. Скопируй этот текст и вставь его в свой `README.md`. Это твое главное оружие.

***

# 🚀 ШПАРГАЛКА ВЫЖИВАЛЬЩИКА: ЭКЗАМЕН (Node.js + PostgreSQL + Vanilla JS)

## ⏱ 0. БЫСТРЫЙ СТАРТ (Первые 5 минут экзамена)
1. Открой **pgAdmin** и создай пустую БД (например, `exam_db`).
2. Проверь `.env`:
   ```env
   PORT=5001 # СТРОГО 5001 для Mac, чтобы избежать ошибки 403 от системы!
   JWT_SECRET=secret_key
   DB_NAME=exam_db
   DB_USER=postgres
   DB_PASSWORD=root # Твой пароль от СУБД
   ```
3. Выполни `npm run dev`. База и таблицы создадутся **АВТОМАТИЧЕСКИ**.

---

## 🗄 1. БАЗА ДАННЫХ И СВЯЗИ (Models)
*ТЗ обычно требует 2 таблицы: Пользователи и Заявки (или Заказы, Записи и т.д.).*

**1. Шаблон Пользователя (`models/User.js`)**
```javascript
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false }, // ФИО
    phone: { type: DataTypes.STRING, allowNull: false }, // Телефон
    email: { type: DataTypes.STRING, allowNull: false }, // Почта
    role: { type: DataTypes.STRING, defaultValue: 'USER' } // Роль (USER / ADMIN)
});
module.exports = User;
```

**2. Шаблон Сущности (Заявка, Заказ, Бронь) (`models/Application.js`)**
```javascript
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Application = sequelize.define('application', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, // Название/Тип
    date: { type: DataTypes.STRING }, // Дата
    status: { type: DataTypes.STRING, defaultValue: 'Новая' }, // Статус для Админа
    message: { type: DataTypes.TEXT } // Комментарий/Отзыв
});
module.exports = Application;
```

**3. Связи (`models/index.js`)**
```javascript
const User = require('./User');
const Application = require('./Application');

User.hasMany(Application); // У юзера много заявок
Application.belongsTo(User); // Заявка принадлежит юзеру (создаст колонку userId)

module.exports = { User, Application };
```

---

## 🧠 2. УМНЫЕ КОНТРОЛЛЕРЫ (Логика и Роли)

**1. Контроллер Авторизации (`controllers/authController.js`)**
*Магия: Сам создает Админа при первой попытке входа по хардкод-данным.*
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJwt = (id, login, role) => jwt.sign({ id, login, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

class AuthController {
    // РЕГИСТРАЦИЯ
    async register(req, res) {
        const { login, password, fullName, phone, email } = req.body;
        if (await User.findOne({ where: { login } })) return res.status(400).json({ message: "Логин занят" });

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ login, password: hashPassword, fullName, phone, email, role: 'USER' });
        return res.json({ token: generateJwt(user.id, user.login, user.role), role: user.role });
    }

    // ВХОД
    async login(req, res) {
        const { login, password } = req.body;

        // --- ХАРДКОД АДМИНА ПО ТЗ (поменяй логин/пароль на нужные) ---
        if (login === 'Admin26' && password === 'Demo20') {
            let admin = await User.findOne({ where: { login } });
            if (!admin) {
                const hashPassword = await bcrypt.hash(password, 5);
                admin = await User.create({ login, password: hashPassword, fullName: 'Админ', phone: '-', email: '-', role: 'ADMIN' });
            }
            return res.json({ token: generateJwt(admin.id, admin.login, admin.role), role: admin.role });
        }
        // -------------------------------------------------------------

        const user = await User.findOne({ where: { login } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Неверный логин или пароль" });
        }
        return res.json({ token: generateJwt(user.id, user.login, user.role), role: user.role });
    }
}
module.exports = new AuthController();
```

**2. Контроллер Сущности с проверкой ролей (`controllers/applicationController.js`)**
```javascript
const { Application, User } = require('../models');

class ApplicationController {
    // СОЗДАНИЕ (Только для Юзера)
    async create(req, res) {
        const { title, date } = req.body;
        const app = await Application.create({ title, date, userId: req.user.id });
        return res.json(app);
    }

    // ПОЛУЧЕНИЕ ДАННЫХ (Разделение Админ / Юзер)
    async getAll(req, res) {
        if (req.user.role === 'ADMIN') {
            // Админ видит ВСЁ + инфу о том, кто создал (include: User)
            const apps = await Application.findAll({ include: User, order: [['createdAt', 'DESC']] });
            return res.json(apps);
        }
        // Юзер видит только СВОЕ
        const apps = await Application.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        return res.json(apps);
    }

    // ИЗМЕНЕНИЕ СТАТУСА (Для Админа)
    async updateStatus(req, res) {
        await Application.update({ status: req.body.status }, { where: { id: req.params.id } });
        return res.json({ message: "Статус обновлен" });
    }
}
module.exports = new ApplicationController();
```

---

## 🖥 3. ФРОНТЕНД - SPA МОНОЛИТ (`public/index.html`)
Копируй этот файл целиком. Это Single Page Application. Он сам переключает экраны, проверяет регулярки и разделяет интерфейс Админа и Юзера.

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Экзамен</title>
    <style>
        body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .screen { display: none; } /* Скрыто по умолчанию */
        .active { display: block; } /* Активный экран */
        input, select, button { display: block; margin-bottom: 10px; width: 100%; padding: 8px; }
        .card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
        .error { color: red; font-size: 14px; }
        .link { color: blue; cursor: pointer; text-decoration: underline; }
    </style>
</head>
<body>

    <!-- 1. ЭКРАН ЛОГИНА -->
    <div id="loginScreen" class="screen active">
        <h2>Вход</h2>
        <input type="text" id="logLogin" placeholder="Логин">
        <input type="password" id="logPass" placeholder="Пароль">
        <button onclick="login()">Войти</button>
        <p class="error" id="logError"></p>
        <p class="link" onclick="switchScreen('regScreen')">Нет аккаунта? Регистрация</p>
    </div>

    <!-- 2. ЭКРАН РЕГИСТРАЦИИ -->
    <div id="regScreen" class="screen">
        <h2>Регистрация</h2>
        <input type="text" id="regLogin" placeholder="Логин (мин 6 символов, латиница и цифры)">
        <input type="password" id="regPass" placeholder="Пароль (мин 8 символов)">
        <input type="text" id="regName" placeholder="ФИО">
        <input type="text" id="regPhone" placeholder="Телефон 8(XXX)XXX-XX-XX">
        <input type="email" id="regEmail" placeholder="E-mail">
        <button onclick="register()">Создать аккаунт</button>
        <p class="error" id="regError"></p>
        <p class="link" onclick="switchScreen('loginScreen')">Уже есть аккаунт? Войти</p>
    </div>

    <!-- 3. ЭКРАН ПОЛЬЗОВАТЕЛЯ -->
    <div id="userScreen" class="screen">
        <h2>Личный кабинет</h2>
        <button onclick="logout()" style="background: red; color: white;">Выйти</button>
        
        <h3>Новая заявка</h3>
        <input type="text" id="appTitle" placeholder="Название услуги / помещения">
        <input type="date" id="appDate">
        <button onclick="createData()">Отправить</button>

        <h3>Мои заявки</h3>
        <div id="userList"></div>
    </div>

    <!-- 4. ЭКРАН АДМИНА -->
    <div id="adminScreen" class="screen">
        <h2>Панель Администратора</h2>
        <button onclick="logout()" style="background: red; color: white;">Выйти</button>
        
        <h3>Все заявки в системе</h3>
        <div id="adminList"></div>
    </div>

    <script>
        const API = 'http://localhost:5001/api'; // ПОРТ 5001 ДЛЯ MAC OS!

        // ПРОВЕРКА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
        window.onload = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token) {
                switchScreen(role === 'ADMIN' ? 'adminScreen' : 'userScreen');
                loadData();
            }
        };

        // ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ
        function switchScreen(id) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function logout() {
            localStorage.clear();
            switchScreen('loginScreen');
        }

        // --- ВАЛИДАЦИЯ (БЕЗОПАСНЫЕ РЕГУЛЯРКИ) ---
        function validate(login, pass, phone, email) {
            if (!/^[a-zA-Z0-9]{6,}$/.test(login)) return "Логин: мин 6 символов (только латиница и цифры)";
            if (pass.length < 8) return "Пароль: мин 8 символов";
            if (!/^8\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone.trim())) return "Телефон: формат 8(XXX)XXX-XX-XX";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail: неверный формат";
            return null; // Ошибок нет
        }

        // --- АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ ---
        async function authRequest(endpoint, body, errorId) {
            const res = await fetch(`${API}/auth/${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                location.reload(); // Перезагружаем страницу для применения прав
            } else {
                document.getElementById(errorId).innerText = data.message;
            }
        }

        async function login() {
            authRequest('login', {
                login: document.getElementById('logLogin').value,
                password: document.getElementById('logPass').value
            }, 'logError');
        }

        async function register() {
            const body = {
                login: document.getElementById('regLogin').value,
                password: document.getElementById('regPass').value,
                fullName: document.getElementById('regName').value,
                phone: document.getElementById('regPhone').value,
                email: document.getElementById('regEmail').value
            };
            
            const err = validate(body.login, body.password, body.phone, body.email);
            if (err) return document.getElementById('regError').innerText = err;

            authRequest('register', body, 'regError');
        }

        // --- РАБОТА С ДАННЫМИ (ЗАЯВКИ) ---
        async function loadData() {
            const role = localStorage.getItem('role');
            const res = await fetch(`${API}/applications`, { // ИЗМЕНИ РОУТ ЕСЛИ НАДО
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const items = await res.json();

            const container = document.getElementById(role === 'ADMIN' ? 'adminList' : 'userList');
            container.innerHTML = '';

            items.forEach(item => {
                let html = `<div class="card">
                    <b>Название:</b> ${item.title} | <b>Дата:</b> ${item.date} <br>
                    <b>Статус:</b> <span style="color: blue">${item.status}</span> <br>`;

                // ЕСЛИ АДМИН -> ПОКАЗЫВАЕМ КНОПКИ СМЕНЫ СТАТУСА И ИНФУ КЛИЕНТА
                if (role === 'ADMIN') {
                    html += `<b>Клиент:</b> ${item.user.fullName} (${item.user.phone}) <br>
                        <select id="stat_${item.id}">
                            <option value="Новая">Новая</option>
                            <option value="Подтверждена">Подтверждена</option>
                            <option value="Отклонена">Отклонена</option>
                        </select>
                        <button onclick="changeStatus(${item.id})">Сменить статус</button>`;
                }
                html += `</div>`;
                container.innerHTML += html;
            });
        }

        async function createData() {
            const body = {
                title: document.getElementById('appTitle').value,
                date: document.getElementById('appDate').value
            };
            await fetch(`${API}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(body)
            });
            loadData();
        }

        async function changeStatus(id) {
            const status = document.getElementById(`stat_${id}`).value;
            await fetch(`${API}/applications/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ status })
            });
            loadData();
        }
    </script>
</body>
</html>
```

---

## 🆘 ЧАСТЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ (MAC OS EDITION)

| Проблема | Решение |
| :--- | :--- |
| **Ошибка 403 Forbidden** в консоли браузера при регистрации/логине. | На MacOS порт 5000 занят системой. Измени порт на `5001` в файле `.env` и в `index.html` (переменная `API`). Перезапусти сервер. |
| **"Телефон: формат 8(XXX)..."** не дает пройти регистрацию. | Проверь, не поставил ли ты пробел перед 8 или после скобок. Наша регулярка разрешает 1 пробел: `8(999) 111-22-33` или `8(999)111-22-33`. |
| **"password authentication failed for user postgres"** в консоли VS Code | Неверный пароль от базы данных. Вспомни пароль от pgAdmin и впиши в `.env` (DB_PASSWORD). |
| **"relation 'users' does not exist"** | Удалил таблицы руками? Останови сервер `Ctrl+C` и запусти снова `npm run dev`. Sequelize создаст их заново. |
| **Админ не может зайти / Админка не появляется** | Зайди в `authController.js`, найди хардкод блок админа, посмотри точные `login` и `password`. При первом вводе этих данных аккаунт создастся сам. |
