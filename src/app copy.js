const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConn = require('express-myconnection');

const app = express();

// importing routes
const colorRoutes = require('./routes/color');
const razaRoutes = require('./routes/raza');
const mainRoutes = require('./routes/main');
const animalRoutes = require('./routes/animal');
const ciclovitalRoutes = require('./routes/ciclovital');
const fincaRoutes = require('./routes/finca');
const hatoRoutes = require('./routes/hato');

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(morgan('dev'));
app.use(myConn(mysql , {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'ganadodb'
},'single'));
app.use(express.urlencoded({extended: false}));

// routes
app.use('/', mainRoutes);
app.use('/razas', razaRoutes);
app.use('/colores', colorRoutes);
app.use('/animales', animalRoutes);
app.use('/ciclovitales', ciclovitalRoutes);
app.use('/fincas', fincaRoutes);
app.use('/hatos', hatoRoutes);


// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});


