const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
	quantity: { type: DataTypes.INTEGER, allowNull: false },
});

const Product = sequelize.define('product', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
	price: { type: DataTypes.FLOAT, allowNull: false },
	img: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.TEXT, allowNull: false },
	inStock: { type: DataTypes.BOOLEAN, allowNull: false },
});

const Category = sequelize.define('category', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ProductInfo = sequelize.define('product_info', {
	id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket, { onDelete: 'cascade' });
Basket.belongsTo(User);

Basket.hasMany(BasketProduct, { onDelete: 'cascade' });
BasketProduct.belongsTo(Basket);

Category.hasMany(Product, { onDelete: 'cascade' });
Product.belongsTo(Category);

Product.hasMany(BasketProduct, { onDelete: 'cascade' });
BasketProduct.belongsTo(Product);

Product.hasMany(ProductInfo, { as: 'info' }, { onDelete: 'cascade' });
ProductInfo.belongsTo(Product);

module.exports = {
	User,
	Basket,
	BasketProduct,
	Product,
	Category,
	ProductInfo,
};
