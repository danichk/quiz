var models = require('../models/models.js');
var sequelize = require('sequelize');

//Get numQuiz
var numQ = function() {

};

exports.index = function(req, res) {

	var statistics = {};
	models.Quiz.count()
	.then(function(numQuiz) {
		statistics.numQuiz = numQuiz;
		return models.Comment.countPublished();
	})
	.then(function(countPublished) {
		statistics.countPublished = countPublished;
		return models.Comment.countQuizesCommented();
	})
	.then(function(quizesCommented) {
		statistics.quizesCommented = quizesCommented;
	})
	.then(function() {
		statistics.quizesUnCommented = statistics.numQuiz - statistics.quizesCommented;
		statistics.averageComments = statistics.countPublished / statistics.numQuiz;
		res.render('quizes/statistics', {statistics: statistics, errors: []});
	});

};
