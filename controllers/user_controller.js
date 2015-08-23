var users = {
	admin: {id: 1, username: "admin", password: "1234"},
	user: {id: 2, username: "user", password: "5678"}
};

// Comprueba si el usuario está registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function (login, password, callback) {
	models.User.find({
		where: {
			username: login
		}
	}).then(function (user) {
		if (user) {
			if (user.verifyPassword(password)) {
				callback(null, user);
			}
			else {
				callback (new Error('Password erróneo.'));
			}
		}
		else {
			callback (new Error('No existe user=' + login));
		}
	}).catch(function (error) {
		callback(error);
	});	
};