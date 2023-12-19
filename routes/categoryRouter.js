const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddleWare');

router.post('/', checkRole('ADMIN'), categoryController.create);
router.get('/', categoryController.getAll);
router.delete('/:id', checkRole('ADMIN'), categoryController.delete);

module.exports = router;
