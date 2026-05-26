const { Review, Booking, User } = require('../models/models');

class ReviewController {
    async create(req, res) {
        try {
            const { bookingId, text } = req.body;
            
            // Проверяем, принадлежит ли заявка пользователю
            const booking = await Booking.findOne({ where: { id: bookingId, userId: req.user.id } });
            if (!booking) {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            
            // Требование модуля 2: отзыв только после изменения статуса админом
            if (booking.status === 'Новая') {
                return res.status(400).json({ message: "Оставить отзыв можно только после обработки заявки администратором" });
            }

            const review = await Review.create({ text, bookingId, userId: req.user.id });
            res.status(201).json(review);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при создании отзыва" });
        }
    }

    async getAll(req, res) {
        try {
            // Подтягиваем User, чтобы на фронте вывести Имя автора отзыва
            const reviews = await Review.findAll({ include: User });
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при получении отзывов" });
        }
    }
}

module.exports = new ReviewController();
