const express = require('express');
const session = require('express-session');
const app = express();
const port = 3001;

app.use(session({
    secret: 'SECRETO',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}));

//MIDDLEWARE PARA LEER LOS DATOS DEL FORMULARIO
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//usuario simulado
const usuarioMock = {
    username: 'admin',
    password: '123'
};

app.get('/', (req, res) => {
    res.redirect('/login');
});

//RUTA DE ACCESO AL LOGIN
app.get('/login',(req, res) => {
    res.render('index');
});

// PROSESAMIENTTO DE LOGIN
app.post('/login', (req, res) => {
    const {username, password} = req.body;

    if(username === usuarioMock.username && password === usuarioMock.password){
        req.session.usuario = username;
        console.log('[LOG] Usuario autenticado');
        res.redirect('/pous');
}else{
    console.log('[LOG] Usuario no autenticado');
    res.status(401).send('Usuario o contraseña incorrectos. <a href="/login">Volver a intentar</a>');
}

});

//MIDDLEWARE DE PROTECCION DE RUTAS
const verificarSesion = (req, res, next) => {
    if (req.session.usuario){
        next();
    }else{
        console.log('[LOG] Intento de acceso a ruta protegida sin sesion activa');
        res.status(403).send('Acceso denegado. debes iniciar sesion. <a href="/login">Ir al Login</a>');
    }
};

// Ruta protegida
app.get('/pous', verificarSesion, (req, res) => {
    res.render('about', { usuario: req.session.usuario });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(`[LOG] Sesión cerrada.`);
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});