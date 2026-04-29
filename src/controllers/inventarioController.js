const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                i.idProducto,
                i.idFinca,
                i.idUsuario,
                i.cantidad,
                i.fecha,
                DATE_FORMAT(i.fecha, '%Y-%m-%d') AS fechaIso,
                CONCAT(DATE_FORMAT(i.fecha, '%m/%d/%Y'), ' GMT-6 CST') AS fechaFormateada,
                p.codigo AS codigoProducto,
                p.nombre AS nombreProducto,
                f.codigo AS codigoFinca,
                f.nombre AS nombreFinca,
                u.codigo AS codigoUsuario,
                u.nombreUsuario,
                u.nombreCompleto
            FROM inventario i
            INNER JOIN producto p ON i.idProducto = p.idProducto
            INNER JOIN finca f ON i.idFinca = f.idFinca
            INNER JOIN usuario u ON i.idUsuario = u.idUsuario
            ORDER BY i.fecha DESC, p.nombre, f.nombre, u.nombreUsuario
        `, (listErr, inventarios) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query(`
                SELECT
                    MIN(idProducto) AS idProducto,
                    codigo,
                    nombre
                FROM producto
                GROUP BY codigo, nombre
                ORDER BY codigo, nombre
            `, (prodErr, productos) => {
                if (prodErr) {
                    res.json(prodErr);
                    return;
                }

                conn.query('SELECT idFinca, codigo, nombre FROM finca ORDER BY codigo, nombre, idFinca', (fincaErr, fincas) => {
                    if (fincaErr) {
                        res.json(fincaErr);
                        return;
                    }

                    conn.query('SELECT idUsuario, codigo, nombreUsuario, nombreCompleto FROM usuario ORDER BY codigo, nombreUsuario, idUsuario', (usuarioErr, usuarios) => {
                        if (usuarioErr) {
                            res.json(usuarioErr);
                            return;
                        }

                        res.render('inventarios', {
                            data: inventarios,
                            dataProductos: productos,
                            dataFincas: fincas,
                            dataUsuarios: usuarios
                        });
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.cantidad === '' || data.cantidad === null) {
        data.cantidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT IGNORE INTO inventario set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/inventarios');
        });
    });
};

controller.edit = (req, res) => {
    const { idProducto, idFinca, idUsuario, fecha } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                i.*,
                DATE_FORMAT(i.fecha, '%Y-%m-%d') AS fechaIso
            FROM inventario i
            WHERE i.idProducto = ?
              AND i.idFinca = ?
              AND i.idUsuario = ?
              AND i.fecha = ?
        `, [idProducto, idFinca, idUsuario, fecha], (invErr, inventario) => {
            if (invErr) {
                res.json(invErr);
                return;
            }

            conn.query(`
                SELECT
                    MIN(idProducto) AS idProducto,
                    codigo,
                    nombre
                FROM producto
                GROUP BY codigo, nombre
                ORDER BY codigo, nombre
            `, (prodErr, productos) => {
                if (prodErr) {
                    res.json(prodErr);
                    return;
                }

                conn.query('SELECT idFinca, codigo, nombre FROM finca ORDER BY codigo, nombre, idFinca', (fincaErr, fincas) => {
                    if (fincaErr) {
                        res.json(fincaErr);
                        return;
                    }

                    conn.query('SELECT idUsuario, codigo, nombreUsuario, nombreCompleto FROM usuario ORDER BY codigo, nombreUsuario, idUsuario', (usuarioErr, usuarios) => {
                        if (usuarioErr) {
                            res.json(usuarioErr);
                            return;
                        }

                        res.render('inventario_edit', {
                            data: inventario[0],
                            dataProductos: productos,
                            dataFincas: fincas,
                            dataUsuarios: usuarios,
                            oldKeys: {
                                idProducto,
                                idFinca,
                                idUsuario,
                                fecha
                            }
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { idProducto, idFinca, idUsuario, fecha } = req.params;
    const newData = req.body;

    if (newData.cantidad === '' || newData.cantidad === null) {
        newData.cantidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'UPDATE inventario set ? WHERE idProducto = ? AND idFinca = ? AND idUsuario = ? AND fecha = ?',
            [newData, idProducto, idFinca, idUsuario, fecha],
            (updateErr) => {
                if (updateErr) {
                    res.json(updateErr);
                    return;
                }
                res.redirect('/inventarios');
            }
        );
    });
};

controller.delete = (req, res) => {
    const { idProducto, idFinca, idUsuario, fecha } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'DELETE FROM inventario WHERE idProducto = ? AND idFinca = ? AND idUsuario = ? AND fecha = ?',
            [idProducto, idFinca, idUsuario, fecha],
            (deleteErr) => {
                if (deleteErr) {
                    res.json(deleteErr);
                    return;
                }
                res.redirect('/inventarios');
            }
        );
    });
};

module.exports = controller;
