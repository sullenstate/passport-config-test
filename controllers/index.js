var indexController = {
	index: function(req, res) {
		res.render('login');
	},
	login: function(req, res) {
		res.render('login');
	},
	app: function(req, res) {
		res.render('app');
	},
	signup: function(req, res) {
		res.render('signup');
	}
};

module.exports = indexController;