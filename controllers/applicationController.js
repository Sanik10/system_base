const { Application, User } = require('../models');

class ApplicationController {
    async create(req, res) {
        const { room, date, paymentMethod } = req.body;
        const app = await Application.create({ room, date, paymentMethod, userId: req.user.id });
        return res.json(app);
    }

    async getAll(req, res) {
        // Если Админ — отдаем ВСЕ заявки + данные того, кто создал
        if (req.user.role === 'ADMIN') {
            const apps = await Application.findAll({ include: User, order: [['createdAt', 'DESC']] });
            return res.json(apps);
        }
        // Если Юзер — отдаем только его заявки
        const apps = await Application.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        return res.json(apps);
    }

    async updateStatus(req, res) {
        const { status } = req.body;
        await Application.update({ status }, { where: { id: req.params.id } });
        return res.json({ message: "Статус обновлен" });
    }

    async addReview(req, res) {
        const { review } = req.body;
        await Application.update({ review }, { where: { id: req.params.id } });
        return res.json({ message: "Отзыв добавлен" });
    }
}
module.exports = new ApplicationController();
