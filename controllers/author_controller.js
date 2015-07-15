// GET /author
exports.credits = function (req, res) {
	res.render('author', {name: 'Dani Checa', avatar: '/images/avatar.png', video: '', errors: []});
};
