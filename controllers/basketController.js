const { Basket, BasketProduct, Product } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
	async addProduct(req, res, next) {
		let { productId, quantity } = req.query;
		console.log(productId);
		console.log(quantity);
		if (!productId || !quantity) {
			return next(ApiError.internal('Ошибка параметров.'));
		}
		quantity = quantity || 0;
		const product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			return next(ApiError.internal('Продукт не найден.'));
		}
		if (quantity <= 0) {
			return next(
				ApiError.internal('Количество продуктов не может быть меньше нуля.')
			);
		}
		const basket = await Basket.findOne({ where: { userId: req.user.id } });
		if (!basket) {
			return next(ApiError.internal('Корзина пользователя не найдена.'));
		}
		const basketId = basket.id;
		const product_in_basket = await BasketProduct.findOne({
			where: { productId, basketId },
		});
		if (!product_in_basket) {
			const basket_product = await BasketProduct.create({
				basketId: basket.id,
				productId: product.id,
				quantity,
			});
		} else {
			const currentQuantity = product_in_basket.quantity;
			quantity = currentQuantity + parseInt(quantity, 10);
			await BasketProduct.update(
				{ quantity },
				{ where: { basketId: basket.id, productId: product.id } }
			);
		}

		return res.json('Товар доставлен в корзину.');
	}
	async getProducts(req, res, next) {
		let { limit, page, discount } = req.query;
		page = page || 1;
		limit = limit || 10;
		discount = discount || 0;
		let offset = page * limit - limit;
		const basket = await Basket.findOne({ where: { userId: req.user.id } });
		let basket_product = await BasketProduct.findAndCountAll({
			where: { basketId: basket.id },
			limit,
			offset,
		});
		let products = [];
		let cost = { firstCost: 0, discount: 0, totalCost: 0 };

		for (const basketProduct of basket_product.rows) {
			const product = await Product.findOne({
				where: { id: basketProduct.productId },
			});

			products.push({ product, quantity: basketProduct.quantity });
			cost.firstCost += product.price * basketProduct.quantity;
		}
		cost.firstCost = cost.firstCost.toFixed(2);
		cost.discount = cost.firstCost * discount;
		cost.discount = cost.discount.toFixed(2);
		cost.totalCost = cost.firstCost - cost.discount;
		cost.totalCost = cost.totalCost.toFixed(2);
		res.json({ rows: products, cost });
	}
	async deleteProduct(req, res, next) {
		const { productId } = req.query;
		const basket = await Basket.findOne({ where: { userId: req.user.id } });
		const basket_product = await BasketProduct.findOne({
			where: { productId, basketId: basket.id },
		});
		if (!basket_product) {
			return next(ApiError.internal('Продукт в корзине не найден.'));
		}
		basket_product.destroy();
		return res.json('Товар удален из корзины.');
	}
}

module.exports = new BasketController();
