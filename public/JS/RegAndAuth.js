//Регистрация
$('button#Reg').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Reg');
    button.disabled = false;
    e.stopPropagation();
    
    const name = $('input#Name').val();
    const email = $('input#Email').val();
    const password = $('input#Password').val();
    const password2 = $('input#Password2').val();

    //Куча проверок форм
    let text = "";
    if (name == '')
        text += 'Введите имя!\n';
    if(email == '')
        text += 'Введите email!\n';
    if(password == '')
        text += 'Введите пароль!\n';
    if(password.length < 5)
        text +='Пароль должен содержать не менее 6 символов!\n';
    if(password != password2)
        text += 'Введенные пароли не совпадают!';

    //Прошли проверку? Круто, можно и продолжить
    if (text != "")
    {
        alert(text);
        button.disabled = true;
        return;
    }

    //Отдаем запрос
    const responce = await fetch(url + 'reg', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if (result.status == 'ok')
        {
            document.location.href = '/acc';
            button.disabled = true;
        }
        else
        {
            WriteError(result);
            button.disabled = true;
        }
    }

});

//Вход
$('button#Enter').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Enter');
    button.disabled = false;
    e.stopPropagation();

    const email = $('input#Email').val();
    const password = $('input#Password').val();
    
    let text = "";
    if(email == '')
        text += 'Введите email!\n';
    if(password == '')
        text += 'Введите пароль!\n';
    if(password.length < 5)
        text +='Пароль должен содержать не менее 5 символов!\n';

    if (text != "")
    {
        alert(text);
        button.disabled = true;
        return;
    }

    const responce = await fetch(url + 'auth', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if (result.status == 'ok')
        {
            document.location.href = '/acc';
            button.disabled = true;
        }
        else
        {
            WriteError(result);
            button.disabled = true;
        }
    }
});

//Обновление аккаунта
$('button#Update').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Update');
    button.disabled = false;
    e.stopPropagation();
    
    const name = $('input#Name').val();
    const email = $('input#Email').val();
    const oldpassword = $('input#Password').val();
    var newpassword, newpassword2;
    
    let text = "";
    if(name == '')
        text += 'Введите имя!\n';
    if(email == '')
        text += 'Введите email!\n';
    if(oldpassword == '')
        text += 'Введите пароль!\n';
    if(oldpassword.length < 5)
        text +='Пароль должен содержать не менее 5 символов!\n';
    else
    {
        newpassword = $('input#NewPassword').val();
        newpassword2 = $('input#NewPassword2').val();
        if(newpassword == '')
            text += 'Введите новый пароль!\n';
        if(newpassword.length < 5)
            text +='Новый пароль должен содержать не менее 5 символов!\n';
        if(newpassword != newpassword2)
            text += 'Введенные новые пароли не совпадают!';
    }

    if (text != '')
    {
        alert(text);
        button.disabled = true;
        return;
    }

    const responce = await fetch(url + 'regUpdate', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: oldpassword,
            newpassword: newpassword,
            name: name
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if (result.status == 'ok')
        {
            document.location.href = '/acc';
            button.disabled = true;
        }
        else
        {
            WriteError(result);
            button.disabled = true;
        }
    }
});

//Алерт с ошибкой
function WriteError(result) {
    alert('Code: ' + result.code + '\nMessange: ' + result.message);
}