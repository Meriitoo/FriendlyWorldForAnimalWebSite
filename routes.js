const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const friendlyController = require('./controllers/friendlyController');

router.use(homeController);
router.use('/auth', authController);
router.use('/friendly', friendlyController);
router.all('*', (req, res) => {
    res.render('home/404');
});

module.exports = router;