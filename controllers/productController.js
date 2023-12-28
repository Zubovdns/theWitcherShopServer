const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo, Category } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductController {
	async create(req, res, next) {
		try {
			let { id, name, price, categoryId, description, info, inStock } =
				req.body;
			const { img } = req.files;
			let fileName = uuid.v4() + '.jpg';
			img.mv(path.resolve(__dirname, '..', 'static', fileName));

			const product = await Product.create({
				id,
				name,
				price,
				categoryId,
				description,
				img: fileName,
				inStock,
			});

			if (info) {
				info = JSON.parse(info);
				info.forEach((i) =>
					ProductInfo.create({
						title: i.title,
						description: i.description,
						productId: product.id,
					})
				);
			}

			return res.json(product);
		} catch (e) {
			next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res) {
		let { categoryId, limit, page, inStock } = req.query;
		page = page || 1;
		limit = limit || 9;

		//код особенного человека

		if (inStock === 'true') inStock = true;
		else inStock = false;

		console.log(inStock);
		let offset = page * limit - limit;
		let products;
		if (!categoryId && !inStock) {
			products = await Product.findAndCountAll({ limit, offset });
		} else if (categoryId && !inStock) {
			products = await Product.findAndCountAll({
				where: { categoryId },
				limit,
				offset,
			});
		} else if (!categoryId && inStock) {
			products = await Product.findAndCountAll({
				where: { inStock },
				limit,
				offset,
			});
		} else if (categoryId && inStock) {
			products = await Product.findAndCountAll({
				where: { categoryId, inStock },
				limit,
				offset,
			});
		}

		res.json(products);
	}
	async getOne(req, res) {
		const { id } = req.params;
		const product = await Product.findOne({
			where: { id },
			include: [{ model: ProductInfo, as: 'info' }],
		});
		return res.json(product);
	}
	async delete(req, res, next) {
		const { id } = req.params;
		const product = await Product.findOne({ where: { id } });
		if (!product) {
			return next(ApiError.internal('Товар не найден.'));
		}
		const imageName = product.img;
		await product.destroy();
		const fs = require('fs');
		const imagePath = path.resolve(__dirname, '..', 'static', imageName);
		fs.unlinkSync(imagePath);

		return res.json({ message: 'Товар успешно удален.' });
	}
	async getTopOnCategory(req, res, next) {
		const topProduct1 = await Product.findOne({ where: { categoryId: 1 } });
		const topProduct2 = await Product.findOne({ where: { categoryId: 2 } });
		const topProduct3 = await Product.findOne({ where: { categoryId: 3 } });

		let topProducts = [];
		topProducts = topProducts.concat(topProduct1, topProduct2, topProduct3);
		return res.json(topProducts);
	}
}

module.exports = new ProductController();
