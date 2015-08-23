var path = require('path');

// Postgres DATABASE_URL=postgres://user:password@host:port/database
// SQLite DATABASE_URL=sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar DB SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
	{
		dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, // solo SQLite (.env)
		omitNull: true // solo Postgres
	}
);

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// Importar definición de la tabla User
var user_path = path.join(__dirname, 'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment, {'constraints': true, 'onUpdate': 'cascade', 'onDelete': 'cascade', 'hooks': true}); // Si borramos pregunta, borrar en cascada sus comentarios asociados

// Los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

// Exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function () {
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count === 0) { // la tabla se inicializa solo si está vacía
			User.bulkCreate(
				[
					{username: 'admin', password: '1234', isAdmin: true}, // El administrador solo se puede crear así
					{username: 'user', password: '5678'} // isAdmin por defecto es false
				]
			).then(function () {
				console.log('Base de datos (tabla user) inicializada');
				Quiz.count().then(function (count) {
					if (count === 0) { // La tabla se inicializa solo si está vacía
						Quiz.bulkCreate( // Estos quizes pertenecen al usuario 'user' (id: 2)
							[
								{tema: 'Humanidades', pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2},
								{tema: 'Humanidades', pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2},
								{tema: 'Otro', pregunta: 'Criatura fantástica semejante a un lobo, pero de mayor tamaño, fiereza e inteligencia', respuesta: 'Huargo', UserId: 2}
							]
						).then(function () {
							console.log('Base de datos (tabla quiz) inicializada');
						});
					}
				});
			});
			
		}
	});
});