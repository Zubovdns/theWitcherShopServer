const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require('../middleware/checkRoleMiddleWare');

router.post('/', checkRole('ADMIN'), productController.create);
router.get('/', productController.getAll);
router.get('/top', productController.getTopOnCategory);
router.get('/:id', productController.getOne);
router.delete('/:id', checkRole('ADMIN'), productController.delete);

module.exports = router;
