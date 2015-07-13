var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');

/* Página de entrada (home page) */
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz', errors: [] });
});


// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

router.get('/author', authorController.credits);

module.exports = router;
