// Modelo de User con validación y encriptación de passwords
var crypto = require('crypto');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define(
		'User',
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					notEmpty: { msg: '- Falta username' },
					// Devuelve mensaje de error si username ya existe
					isUnique: function (value, next) {
						var self = this;
						User
						.find({where: {username: value}})
						.then(function (user) {
							if (user && self.id !== user.id) {
								return next('Username ya utilizado');
							}
							return next();
						}).catch(function (err) {
							return next(err);
						});
					}
				}
			},
			password: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: '- Falta password' }
				},
				set: function (password) {
					var encrypted = crypto
									.createHmac('sha1', key)
									.update(password)
									.digest('hex');
					// Evita passwords vacíos
					if (password === '') {
						encrypted = '';
					}
					this.setDataValue('password', encrypted);
				}
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			instanceMethods: {
				verifyPassword: function (password) {
					var encrypted = crypto
									.createHmac('sha1', key)
									.update(password)
									.digest('hex');
					return encrypted === this.password;
				}
			}
		}
	);
	return User;
};