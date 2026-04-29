const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                cp.idPaquete,
                cp.idProducto,
                cp.dosificacion,
                cp.indicaciones,
                cp.funcion,
                cp.fechaCaducidad,
                cp.imagenes,
                DATE_FORMAT(cp.fechaCaducidad, '%Y-%m-%d') AS ymdFechaCaducidad,
                paq.codigo AS codigoPaquete,
                paq.nombre AS nombrePaquete,
                prd.codigo AS codigoProducto,
                prd.nombre AS nombreProducto
            FROM control_paquete cp
            INNER JOIN paquete paq ON cp.idPaquete = paq.idPaquete
            INNER JOIN producto prd ON cp.idProducto = prd.idProducto
            ORDER BY paq.nombre, prd.nombre
        `, (listErr, controles) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre, idPaquete', (paqErr, paquetes) => {
                if (paqErr) {
                    res.json(paqErr);
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

                    res.render('control_paquetes', {
                        data: controles,
                        dataPaquetes: paquetes,
                        dataProductos: productos
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.fechaCaducidad === '' || data.fechaCaducidad === null) {
        data.fechaCaducidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            INSERT INTO control_paquete set ?
            ON DUPLICATE KEY UPDATE
                dosificacion = VALUES(dosificacion),
                indicaciones = VALUES(indicaciones),
                funcion = VALUES(funcion),
                fechaCaducidad = VALUES(fechaCaducidad),
                imagenes = VALUES(imagenes)
        `, [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/control_paquetes');
        });
    });
};

controller.edit = (req, res) => {
    const { idPaquete, idProducto } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                cp.idPaquete,
                cp.idProducto,
                cp.dosificacion,
                cp.indicaciones,
                cp.funcion,
                cp.fechaCaducidad,
                cp.imagenes,
                DATE_FORMAT(cp.fechaCaducidad, '%Y-%m-%d') AS ymdFechaCaducidad
            FROM control_paquete cp
            WHERE cp.idPaquete = ? AND cp.idProducto = ?
        `, [idPaquete, idProducto], (editErr, rows) => {
            if (editErr) {
                res.json(editErr);
                return;
            }

            conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre', (paqErr, paquetes) => {
                if (paqErr) {
                    res.json(paqErr);
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

                    res.render('control_paquete_edit', {
                        data: rows[0],
                        dataPaquetes: paquetes,
                        dataProductos: productos
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { idPaquete, idProducto } = req.params;
    const body = req.body;

    if (body.fechaCaducidad === '' || body.fechaCaducidad === null) {
        body.fechaCaducidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            `UPDATE control_paquete
             SET dosificacion = ?, indicaciones = ?, funcion = ?, fechaCaducidad = ?, imagenes = ?
             WHERE idPaquete = ? AND idProducto = ?`,
            [body.dosificacion || null, body.indicaciones || null, body.funcion || null,
             body.fechaCaducidad, body.imagenes || null, idPaquete, idProducto],
            (updateErr) => {
                if (updateErr) {
                    res.json(updateErr);
                    return;
                }
                res.redirect('/control_paquetes');
            }
        );
    });
};

controller.delete = (req, res) => {
    const { idPaquete, idProducto } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'DELETE FROM control_paquete WHERE idPaquete = ? AND idProducto = ?',
            [idPaquete, idProducto],
            (deleteErr) => {
                if (deleteErr) {
                    res.json(deleteErr);
                    return;
                }
                res.redirect('/control_paquetes');
            }
        );
    });
};

module.exports = controller;
