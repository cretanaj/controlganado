const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const morgan = require('morgan');
const mysql = require('mysql2');
const myConn = require('express-myconnection');
const helmet = require('helmet');
const session = require('express-session');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express()

const getSecretFromFile = (filePath) => {
    if (!filePath) {
        return '';
    }

    try {
        return fs.readFileSync(filePath, 'utf8').trim();
    } catch (error) {
        console.warn(`Could not read secret file at ${filePath}: ${error.message}`);
        return '';
    }
};


// importing routes
const colorRoutes = require('./routes/color');
const razaRoutes = require('./routes/raza');
const mainRoutes = require('./routes/main');
const animalRoutes = require('./routes/animal');
const ciclovitalRoutes = require('./routes/ciclovital');
const fincaRoutes = require('./routes/finca');
const hatoRoutes = require('./routes/hato');
const movimientoHatoRoutes = require('./routes/movimientohato');
const areteRoutes = require('./routes/arete');
const partoRoutes = require('./routes/parto');
const estadoPalpacionRoutes = require('./routes/estadopalpacion');
const estadoPartoRoutes = require('./routes/estadoparto');
const estadoAnimalRoutes = require('./routes/estadoanimal');
const estadoTareaRoutes = require('./routes/estadotarea');
const veterinarioRoutes = require('./routes/veterinario');
const colaboradorRoutes = require('./routes/colaborador');
const tareaRoutes = require('./routes/tarea');
const vacunacionRoutes = require('./routes/vacunacion');
const proveedorRoutes = require('./routes/proveedor');
const productoRoutes = require('./routes/producto');
const paqueteRoutes = require('./routes/paquete');
const actividadRoutes = require('./routes/actividad');
const controlActividadRoutes = require('./routes/controlactividad');
const controlPaqueteRoutes = require('./routes/controlpaquete');
const palpacionRoutes = require('./routes/palpacion');
const googleMapsRoutes = require('./routes/googlemaps');
const notificacionRoutes = require('./routes/notificacion');
const notificacionResumenRoutes = require('./routes/notificacionresumen');
const tipoNotificacionRoutes = require('./routes/tiponotificacion');
const perfilRoutes = require('./routes/perfil');
const usuarioRoutes = require('./routes/usuario');
const asignacionFincaRoutes = require('./routes/asignacionfinca');
const inventarioRoutes = require('./routes/inventario');
const celoRoutes = require('./routes/celo');
const enfermedadRoutes = require('./routes/enfermedad');
const sintomaBovinoRoutes = require('./routes/sintomabovino');
const pesajeRoutes = require('./routes/pesaje');
const clienteRoutes = require('./routes/cliente');
const compraVentaGanadoRoutes = require('./routes/compraventaganado');
const authRoutes = require('./routes/auth');
const permisoRoutes = require('./routes/permiso');
const reporteRoutes = require('./routes/reporte');

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

//console.log(`Servidor escuchando en puerto ${app.get('port')}`);

// middlewares
app.use(morgan('dev'));
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
const dbHost = process.env.DB_HOST || 'test1server.mysql.database.azure.com';
const dbServerName = dbHost.split('.')[0];
const dbUserBase = process.env.DB_USER || 'mysqldb';
const shouldAppendAzureServer = process.env.DB_USER_APPEND_SERVER === 'true';
const dbUser = shouldAppendAzureServer && dbHost.includes('.mysql.database.azure.com') && !dbUserBase.includes('@')
    ? `${dbUserBase}@${dbServerName}`
    : dbUserBase;
const dbPassword = getSecretFromFile(process.env.DB_PASSWORD_FILE) || process.env.DB_PASSWORD || '';

const dbConfig = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'ganadodb'
};

if (!dbConfig.password) {
    console.warn('DB_PASSWORD is empty. Set it in your environment or .env file.');
}

if (process.env.DB_SSL === 'true') {
    dbConfig.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    };

    if (process.env.DB_SSL_CA_PATH) {
        dbConfig.ssl.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
    }
}

app.use(myConn(mysql, dbConfig, 'single'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    name: 'agresto.sid',
    secret: process.env.SESSION_SECRET || 'cambiar-este-secreto-en-produccion',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60 * 1000
    }
}));
app.use(authMiddleware.attachSecurityContext);

// static files
app.use(express.static(path.join(__dirname, 'public')));


// public routes
app.use('/', authRoutes);

// authN + authZ for app modules
app.use(authMiddleware.requireAuthAndAuthorize);

app.use((req, res, next) => {
    res.locals.headerNotifications = [];
    res.locals.headerNotificationsCount = 0;

    if (!req.session || !req.session.user) {
        next();
        return;
    }

    req.getConnection((err, conn) => {
        if (err || !conn) {
            next();
            return;
        }

        conn.query(`
            SELECT *
            FROM _vw_notificaciones
            ORDER BY idNotificacion ASC, idAnimal ASC
            LIMIT 10
        `, (queryErr, rows) => {
            if (!queryErr && Array.isArray(rows)) {
                res.locals.headerNotifications = rows;
                res.locals.headerNotificationsCount = rows.length;
            }

            next();
        });
    });
});

// routes
app.use('/', mainRoutes);
app.use('/razas', razaRoutes);
app.use('/colores', colorRoutes);
app.use('/animales', animalRoutes);
app.use('/ciclovitales', ciclovitalRoutes);
app.use('/fincas', fincaRoutes);
app.use('/hatos', hatoRoutes);
app.use('/movimiento_hatos', movimientoHatoRoutes);
app.use('/aretes', areteRoutes);
app.use('/partos', partoRoutes);
app.use('/estado_palpaciones', estadoPalpacionRoutes);
app.use('/estado_partos', estadoPartoRoutes);
app.use('/estado_animales', estadoAnimalRoutes);
app.use('/estado_tareas', estadoTareaRoutes);
app.use('/veterinarios', veterinarioRoutes);
app.use('/colaboradores', colaboradorRoutes);
app.use('/tareas', tareaRoutes);
app.use('/vacunaciones', vacunacionRoutes);
app.use('/proveedores', proveedorRoutes);
app.use('/productos', productoRoutes);
app.use('/paquetes', paqueteRoutes);
app.use('/actividades', actividadRoutes);
app.use('/control_actividades', controlActividadRoutes);
app.use('/control_paquetes', controlPaqueteRoutes);
app.use('/palpaciones', palpacionRoutes);
app.use('/google_maps', googleMapsRoutes);
app.use('/notificaciones', notificacionRoutes);
app.use('/notificaciones_resumen', notificacionResumenRoutes);
app.use('/tipo_notificaciones', tipoNotificacionRoutes);
app.use('/perfiles', perfilRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/asignacion_fincas', asignacionFincaRoutes);
app.use('/inventarios', inventarioRoutes);
app.use('/celos', celoRoutes);
app.use('/enfermedades', enfermedadRoutes);
app.use('/sintomas_bovinos', sintomaBovinoRoutes);
app.use('/pesajes', pesajeRoutes);
app.use('/clientes', clienteRoutes);
app.use('/compras_ventas_ganado', compraVentaGanadoRoutes);
app.use('/permisos', permisoRoutes);
app.use('/reportes', reporteRoutes);

// --- Lógica anterior de arranque con puertos alternativos restaurada ---
const startServer = (port, retriesLeft = 1) => {
    const server = app.listen(port, () => {
        app.set('port', port);
        console.log(`Server on port ${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use. Trying port ${nextPort}...`);
            startServer(nextPort, retriesLeft - 1);
            return;
        }

        console.error('Failed to start server:', err.message);
        process.exit(1);
    });
};
startServer(Number(app.get('port')));

// --- Inicio recomendado para Azure y producción (comentado) ---
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server on port ${port}`);
// });


