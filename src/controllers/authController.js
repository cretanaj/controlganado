const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authMiddleware = require('../middlewares/authMiddleware');
const permissionService = require('../services/permissionService');

const controller = {};
const envPasswordHash = String(process.env.LOGIN_PASSWORD_HASH || '').trim();

const isBcryptHash = (value) => (
    value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$')
);

const safeEqual = (left, right) => {
    const leftBuffer = Buffer.from(String(left || ''));
    const rightBuffer = Buffer.from(String(right || ''));

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const verifyPassword = async (rawPassword, storedHash) => {
    if (!rawPassword || !storedHash) {
        return false;
    }

    // Si el hash es bcrypt, compara con bcrypt
    if (isBcryptHash(storedHash)) {
        return bcrypt.compare(rawPassword, storedHash);
    }
    // Comparación en texto plano solo para compatibilidad legacy
    return rawPassword === storedHash;
};

controller.showLogin = (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/');
        return;
    }

    res.render('login', {
        error: null,
        username: '',
        next: authMiddleware.sanitizeNext(req.query.next)
    });
};

controller.login = (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const nextPath = authMiddleware.sanitizeNext(req.body.next || req.query.next);

    if (!username || !password) {
        res.status(400).render('login', {
            error: 'Credenciales invalidas.',
            username,
            next: nextPath
        });
        return;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.status(500).render('login', {
                error: 'No se pudo procesar el inicio de sesion.',
                username,
                next: nextPath
            });
            return;
        }

        conn.query(
            `
            SELECT u.idUsuario, u.nombreUsuario, u.nombreCompleto, u.email, u.clave, u.idPerfil, u.estado,
                   p.codigo AS codigoPerfil, p.nombre AS nombrePerfil
            FROM usuario u
            LEFT JOIN perfil p ON p.idPerfil = u.idPerfil
            WHERE u.nombreUsuario = ?
            LIMIT 1
            `,
            [username],
            async (queryErr, rows) => {
                if (queryErr || !rows || rows.length === 0) {
                    res.status(401).render('login', {
                        error: 'Credenciales invalidas.',
                        username,
                        next: nextPath
                    });
                    return;
                }

                const user = rows[0];
                if (Number(user.estado) !== 1) {
                    res.status(401).render('login', {
                        error: 'Usuario inactivo.',
                        username,
                        next: nextPath
                    });
                    return;
                }

                let passwordOk = false;
                try {
                    // Logs para depuración de contraseñas
                    // console.log('Contraseña ingresada:', password);
                    // console.log('Contraseña almacenada (user.clave):', user.clave);
                    // console.log('Hash de entorno (envPasswordHash):', envPasswordHash);

                    if (envPasswordHash) {
                        if (!isBcryptHash(envPasswordHash)) {
                            res.status(500).render('login', {
                                error: 'La configuracion de autenticacion es invalida.',
                                username,
                                next: nextPath
                            });
                            return;
                        }

                        const matchesEnvHash = await bcrypt.compare(password, envPasswordHash);
                        const dbHasSameHash = safeEqual(envPasswordHash, user.clave);
                        passwordOk = matchesEnvHash && dbHasSameHash;
                    } else {
                        passwordOk = await verifyPassword(password, user.clave);
                    }
                } catch (compareErr) {
                    passwordOk = false;
                }

                if (!passwordOk) {
                    res.status(401).render('login', {
                        error: 'Credenciales invalidas.',
                        username,
                        next: nextPath
                    });
                    return;
                }

                if (!envPasswordHash && !(user.clave || '').startsWith('$2')) {
                    const upgradedHash = await bcrypt.hash(password, 12);
                    conn.query('UPDATE usuario SET clave = ? WHERE idUsuario = ?', [upgradedHash, user.idUsuario], () => {});
                }

                req.session.regenerate((sessionErr) => {
                    if (sessionErr) {
                        res.status(500).render('login', {
                            error: 'No se pudo crear la sesion de usuario.',
                            username,
                            next: nextPath
                        });
                        return;
                    }

                    req.session.user = {
                        idUsuario: user.idUsuario,
                        nombreUsuario: user.nombreUsuario,
                        nombreCompleto: user.nombreCompleto,
                        email: user.email,
                        idPerfil: user.idPerfil,
                        codigoPerfil: user.codigoPerfil,
                        nombrePerfil: user.nombrePerfil
                    };

                    permissionService.loadProfilePermissions(conn, user.idPerfil, (permErr, permissionMap) => {
                        req.session.permissionMap = permErr ? {} : permissionMap;
                        req.session.save(() => {
                            res.redirect(nextPath);
                        });
                    });
                });
            }
        );
    });
};

controller.logout = (req, res) => {
    if (!req.session) {
        res.redirect('/login');
        return;
    }

    req.session.destroy(() => {
        res.clearCookie('agresto.sid');
        res.redirect('/login');
    });
};

module.exports = controller;
