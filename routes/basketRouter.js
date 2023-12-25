const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, basketController.addProduct);
router.get('/', authMiddleware, basketController.getProducts);
router.delete('/', authMiddleware, basketController.deleteProduct);

module.exports = router;
