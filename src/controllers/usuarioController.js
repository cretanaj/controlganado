const bcrypt = require('bcryptjs');

const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT u.*, p.nombre AS nombrePerfil
            FROM usuario u
            LEFT JOIN perfil p ON u.idPerfil = p.idPerfil
            ORDER BY u.codigo, u.nombreUsuario
        `, (queryErr, usuarios) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idPerfil, codigo, nombre FROM perfil ORDER BY codigo, nombre', (perfilErr, perfiles) => {
                if (perfilErr) {
                    res.json(perfilErr);
                    return;
                }

                res.render('usuarios', {
                    data: usuarios,
                    dataPerfiles: perfiles
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.idPerfil === '' || data.idPerfil === null) {
        data.idPerfil = null;
    }

    if (data.estado === '' || data.estado === null || typeof data.estado === 'undefined') {
        data.estado = 1;
    }

    if (!data.clave || String(data.clave).trim().length < 8) {
        res.status(400).json({ message: 'La clave debe tener al menos 8 caracteres.' });
        return;
    }

    data.clave = bcrypt.hashSync(String(data.clave), 12);

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO usuario set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/usuarios');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('SELECT * FROM usuario WHERE idUsuario = ?', [id], (queryErr, usuario) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idPerfil, codigo, nombre FROM perfil ORDER BY codigo, nombre', (perfilErr, perfiles) => {
                if (perfilErr) {
                    res.json(perfilErr);
                    return;
                }

                res.render('usuario_edit', {
                    data: {
                        ...usuario[0],
                        clave: ''
                    },
                    dataPerfiles: perfiles
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newUsuario = req.body;

    if (newUsuario.idPerfil === '' || newUsuario.idPerfil === null) {
        newUsuario.idPerfil = null;
    }

    if (newUsuario.estado === '' || newUsuario.estado === null || typeof newUsuario.estado === 'undefined') {
        newUsuario.estado = 1;
    }

    if (newUsuario.clave && String(newUsuario.clave).trim().length > 0) {
        if (String(newUsuario.clave).trim().length < 8) {
            res.status(400).json({ message: 'La clave debe tener al menos 8 caracteres.' });
            return;
        }
        newUsuario.clave = bcrypt.hashSync(String(newUsuario.clave), 12);
    } else {
        delete newUsuario.clave;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE usuario set ? WHERE idUsuario = ?', [newUsuario, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/usuarios');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('DELETE FROM usuario WHERE idUsuario = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/usuarios');
        });
    });
};

module.exports = controller;
