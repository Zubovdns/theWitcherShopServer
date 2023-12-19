const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleWare');

router.post('/registration', userController.registration);
router.post('/login', userController.login);

router.get('/auth', authMiddleware, userController.check);

router.delete('/:id', checkRole('ADMIN'), userController.delete);

module.exports = router;
