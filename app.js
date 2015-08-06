var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');
var indexController = require('./controllers/index.js');
var authenticationController = require('./controllers/authentication');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(session({
	secret: 'qelpNPCQZabsSunE',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);
app.get('/login', authenticationController.login);
app.post('/login', authenticationController.processLogin);
app.get('/signup', indexController.signup);
app.post('/signup', authenticationController.processSignup);
app.get('/logout', authenticationController.logout);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/app',
	failureRedirect: '/login'}));
app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
		res.redirect('/app');
	}
);

// Middleware (defined in our config/passport.js module.exports),
// that prevents unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);

app.get('/app', indexController.app);

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
