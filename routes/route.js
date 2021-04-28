const express = require("express");
const jsonParser = express.json();
const fs = require("fs");
const passport = require("passport");
const { send } = require("process");


//Это для страницы по умолчанию
const router = app => {
    app.get('/', (req, res) => {
        if(req.user == undefined)
            res.render('./views/pages/logIn.ejs', { email: undefined });
        else
            res.render('./views/pages/acc.ejs', { email: req.user.email, name: req.user.name });
    });

    //Это для страницы регистрации
    app.get('/register', (req, res) => {
        if(req.user == undefined)
            res.render('./views/pages/register.ejs', { email: undefined });
        else
            res.render('./views/pages/register.ejs', { email: req.user.email });
    });

    //Это для регистрации пользователя
    app.post('/reg', (req, res, next) => {
        passport.authenticate('local-signup', function(err, user) {
            if(err){
                let error = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(error);
            }
            if(!user){
                let error = { status: 'error', code: 400, message: 'Возникла ошибка при регистрации!' };
                return res.send(error);
            }
            //А это для авторизации
            req.logIn(user, function(err) {
                if (err)
                {
                    let error = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                    return res.send(error);
                }
                //перенаправление
                let response = {status: 'ok', code: 200, message: 'Регистрация прошла успешно!'};
                return res.send(response);
            });
        })(req, res, next);
    });

    //Это для авторизации пользователя
    app.post('/auth', (req, res, next) => {
        passport.authenticate('local-login', function(err, user) {
            if (err)
            {
                let error = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(error);
            }
            //Нет данных? Ну и иди
            if (!user)
            {
                let error = { status: 'error', code: 400, message: 'Укажите правильный email или пароль!' };
                return res.send(error);
            }
            //Тут уж точно авторизация
            req.logIn(user, function(err){
                if (err)
                {
                    let error = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                    return res.send(error);
                }
                //Отправляем запрос
                let response = {status: 'ok', code: 200, message: 'Авторизация прошла успешно!'};
                return res.send(response);
            });
            
        })(req, res, next);
    });

    //Проверка авторизации
    const auth =  (req, res, next) => {
        if(req.isAuthenticated())
            //Опааа, прошли авторизацию, можно и отправляться дальше
            next();
        else
            //Ну не фортануло, возвращаемся обратно...
            return res.redirect('/');
    };

    //Это страница аккаунта
    app.get('/acc', (req, res, next) => {
        if(req.isAuthenticated())
            res.render('./views/pages/acc.ejs', { email: req.user.email, name: req.user.name } );
        else
            return res.redirect('/');
    });

    //Это для редактирования пользователя
    app.post('/regUpdate', auth, (req, res, next) => {
        passport.authenticate('local-update', function(err, user) {
            if (err)
            {
                let error = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(error);
            }
            if (!user)
            {
                let error = { status: 'error', code: 400, message: 'Возникла ошибка при смене пароля!' };
                return res.send(error);
            }
            if (user)
            {
                let response = {status: 'ok', code: 200, message: 'Редактирование данных прошло успешно!'};
                return res.send(response);
            }
        })(req, res, next);
    });

    //Это для выхода из аккаунта
    app.get('/logout', (req, res) => {
        req.session.destroy(() => { 
            res.clearCookie('connect.sid'); 
            res.redirect('/');
        });
    });
}

module.exports = router;