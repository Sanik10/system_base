const { Booking, User, Review } = require('../models/models');

class BookingController {
    // 1. Создать заявку (Пользователь)
    async create(req, res) {
        try {
            const { room_type, event_date, payment_method } = req.body;
            const booking = await Booking.create({
                room_type,
                event_date,
                payment_method,
                userId: req.user.id // Берем id из токена (authMiddleware)
            });
            res.status(201).json(booking);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при создании заявки" });
        }
    }

    // 2. Получить свои заявки (Пользователь)
    async getMine(req, res) {
        try {
            const bookings = await Booking.findAll({ 
                where: { userId: req.user.id },
                include: Review
            });
            res.json(bookings);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении заявок" });
        }
    }

    // 3. Получить ВСЕ заявки (Админ)
    async getAll(req, res) {
        try {
            const bookings = await Booking.findAll({ 
                include: [User, Review]
            }); 
            res.json(bookings);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении заявок" });
        }
    }

    // 4. Изменить статус заявки (Админ)
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'Банкет назначен', 'Банкет завершен'
            
            const booking = await Booking.findByPk(id);
            if (!booking) return res.status(404).json({ message: "Заявка не найдена" });
            
            booking.status = status;
            await booking.save(); // Sequelize сам обновит запись в БД
            
            res.json(booking);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении статуса" });
        }
    }
}

module.exports = new BookingController();
