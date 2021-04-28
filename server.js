const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');

//Так в гайдике было написано...
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));

//Подключаем папку public + настройка сессии
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(
{
    secret: 'AnotherSecret?AreYouSerious???',
    store: new FileStore(),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));
//Чтобы с CryptoJS нормально работать
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

//Боже рауты - это божественно
const routes = require('./routes/route.js');
routes(app);

// Открытия сервака по порту
const server = app.listen(port, (error) => {
    if(error){
        return console.log(`Error: ${error}`);
    }
    console.log(`Example app listening at http://localhost:${port}`);
})