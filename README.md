# 🛠 Инструкция по сборке проекта на Экзамене (PostgreSQL + Express)

## 0. Подготовка базы данных (ПЕРЕД ЗАПУСКОМ)
1. Открой pgAdmin (или DBeaver, что будет на экзамене).
2. Создай пустую базу данных, назови её `exam_db` (или как требует ТЗ).
3. Проверь файл `.env`. Логин и пароль должны совпадать с СУБД (обычно postgres / root или postgres).
4. Запусти проект `node server.js`. 
5. **Магия:** Sequelize сам создаст все таблицы в БД!

---

## 🧩 ПАЗЛ 1: Как добавить новую таблицу (сущность) из ТЗ?
Допустим, в ТЗ сказано: "Должны быть Заказы (Order). Заказ содержит сумму (amount) и статус (status)".

**Шаг 1. Создай модель (`models/Order.js`)**
```javascript
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'PENDING' } // По умолчанию "В ожидании"
});

module.exports = Order;
```

**Шаг 2. Подключи модель в `models/index.js`**
```javascript
const Order = require('./Order'); // 1. Импорт

// Если Заказ принадлежит Пользователю (Связь 1 ко многим)
User.hasMany(Order);
Order.belongsTo(User);

module.exports = { User, Item, Order }; // 2. Добавь в экспорт
```
*(После перезапуска сервера таблица `orders` появится в базе данных автоматически!)*

---

## 🧩 ПАЗЛ 2: Как написать логику (CRUD) для новой таблицы?
**Шаг 1. Создай `controllers/orderController.js`**
Копируй шаблон:
```javascript
const { Order } = require('../models'); // Берем модель из index.js

class OrderController {
    // СОЗДАНИЕ
    async create(req, res) {
        const { amount, status } = req.body;
        const order = await Order.create({ amount, status, userId: req.user.id }); // userId берем из токена
        return res.json(order);
    }
    // ПОЛУЧЕНИЕ ВСЕХ (с фильтрацией, если надо)
    async getAll(req, res) {
        // await Order.findAll({ where: { userId: req.user.id } }) - получить только свои заказы
        const orders = await Order.findAll();
        return res.json(orders);
    }
    // ОБНОВЛЕНИЕ
    async update(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        await Order.update({ status }, { where: { id } });
        return res.json({ message: "Обновлено" });
    }
    // УДАЛЕНИЕ
    async delete(req, res) {
        const { id } = req.params;
        await Order.destroy({ where: { id } });
        return res.json({ message: "Удалено" });
    }
}
module.exports = new OrderController();
```

**Шаг 2. Создай роуты `routes/orderRouter.js`**
```javascript
const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); // Защита токеном

router.post('/', authMiddleware, orderController.create);
router.get('/', orderController.getAll); // Публичный
router.put('/:id', authMiddleware, orderController.update);
router.delete('/:id', authMiddleware, orderController.delete);

module.exports = router;
```

**Шаг 3. Зарегистрируй роут в `routes/index.js`**
```javascript
const orderRouter = require('./orderRouter');
router.use('/orders', orderRouter); 
// Теперь АПИ доступно по http://localhost:5000/api/orders
```

---

## 🧩 ПАЗЛ 3: ER-Диаграмма (Связи таблиц в Sequelize)
Если на экзамене просят связи. Все это пишется **ТОЛЬКО** в файле `models/index.js`.

**1 к 1 (One-to-One):** У пользователя одна корзина.
```javascript
User.hasOne(Basket);
Basket.belongsTo(User);
```

**1 ко Многим (One-to-Many):** У магазина много товаров.
```javascript
Store.hasMany(Item);
Item.belongsTo(Store);
// Sequelize автоматически создаст колонку storeId в таблице Item!
```

**Многие ко Многим (Many-to-Many):** Студент ходит на многие курсы, на курсе много студентов.
```javascript
// Нужна промежуточная таблица (Например, StudentCourse)
const StudentCourse = sequelize.define('student_course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Student.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(Student, { through: StudentCourse });
```

---

## 🧩 ПАЗЛ 4: Фронтенд на чистом JS (Fetch)
Если попросят накидать HTML интерфейс.
Создай файл `index.html` и открой его в браузере.

**1. Логин (получение токена)**
```javascript
async function login() {
    const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'admin', password: 'admin' }) // Хардкод данные из authController
    });
    const data = await res.json();
    localStorage.setItem('token', data.token); // Сохранили токен!
}
```

**2. Запрос с Токеном (Создание)**
```javascript
async function createItem() {
    const token = localStorage.getItem('token');
    
    await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ОБЯЗАТЕЛЬНАЯ СТРОКА
        },
        body: JSON.stringify({ title: 'Телевизор', price: 20000 })
    });
}
```

---
## 🆘 СКОРАЯ ПОМОЩЬ (ОШИБКИ)
*   **"password authentication failed for user postgres"** -> Ошибка в `.env`, неверный пароль к БД pgAdmin.
*   **"relation 'items' does not exist"** -> Sequelize не создал таблицы. Убедись, что модель подключена в `models/index.js` и в `server.js` стоит `sequelize.sync({ alter: true })`.
*   **"Cannot destructure property 'title' of 'req.body' as it is undefined"** -> Забыл `app.use(express.json())` в `server.js`.
*   **"CORS error" на фронте** -> Забыл `app.use(cors())` в `server.js`.
