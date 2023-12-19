const { Category } = require('../models/models');
const ApiError = require('../error/ApiError');

class CategoryController {
	async create(req, res, next) {
		const { name } = req.body;
		if (!name) {
			return next(ApiError.internal('Необходимо ввести название категории.'));
		}
		const category = await Category.create({ name });
		return res.json({ category });
	}
	async getAll(req, res) {
		const categories = await Category.findAll();
		return res.json(categories);
	}
	async delete(req, res, next) {
		const { id } = req.params;
		const category = await Category.findOne({ where: { id } });
		if (!category) {
			return next(ApiError.internal('Категория не найдена.'));
		}
		await category.destroy();
		return res.json({ message: 'Категория успешно удалена.' });
	}
}

module.exports = new CategoryController();
