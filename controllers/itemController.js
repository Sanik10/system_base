const { Item } = require('../models');

class ItemController {
    async create(req, res) {
        try {
            const { title, price, description } = req.body;
            // req.user.id берется из authMiddleware (кто создал)
            const item = await Item.create({ title, price, description, userId: req.user.id });
            return res.json(item);
        } catch (e) {
            return res.status(500).json({ message: "Ошибка создания", error: e.message });
        }
    }

    async getAll(req, res) {
        const items = await Item.findAll();
        return res.json(items);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const item = await Item.findOne({ where: { id } });
        return res.json(item);
    }

    async delete(req, res) {
        const { id } = req.params;
        await Item.destroy({ where: { id } });
        return res.json({ message: "Удалено успешно" });
    }
}

module.exports = new ItemController();
