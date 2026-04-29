const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                v.*,
                CONCAT(DATE_FORMAT(v.fecha, '%m/%d/%Y'), ' GMT-6 CST') AS fechaFormateada,
                h.nombre AS nombreHato,
                a.codigo AS codigoAnimal,
                a.nombre AS nombreAnimal,
                p.codigo AS codigoPaquete,
                p.nombre AS nombrePaquete
            FROM vacunacion v
            LEFT JOIN hato h ON v.idHato = h.idHato
            LEFT JOIN animal a ON v.idAnimal = a.idAnimal
            LEFT JOIN paquete p ON v.idPaquete = p.idPaquete
            ORDER BY v.fecha DESC, v.idVacunacion DESC
        `, (queryErr, vacunaciones) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idHato, nombre FROM hato ORDER BY nombre', (hatoErr, hatos) => {
                if (hatoErr) {
                    res.json(hatoErr);
                    return;
                }

                conn.query('SELECT idAnimal, codigo, nombre, idHato FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                    if (animalErr) {
                        res.json(animalErr);
                        return;
                    }

                    conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre', (paqueteErr, paquetes) => {
                        if (paqueteErr) {
                            res.json(paqueteErr);
                            return;
                        }

                        res.render('vacunaciones', {
                            data: vacunaciones,
                            dataHato: hatos,
                            dataAnimal: animales,
                            dataPaquete: paquetes
                        });
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO vacunacion set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/vacunaciones');
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

        conn.query(`
            SELECT
                v.*,
                DATE_FORMAT(v.fecha, '%Y-%m-%d') AS ymdFecha
            FROM vacunacion v
            WHERE v.idVacunacion = ?
        `, [id], (queryErr, vacunacion) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idHato, nombre FROM hato ORDER BY nombre', (hatoErr, hatos) => {
                if (hatoErr) {
                    res.json(hatoErr);
                    return;
                }

                conn.query('SELECT idAnimal, codigo, nombre, idHato FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                    if (animalErr) {
                        res.json(animalErr);
                        return;
                    }

                    conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre', (paqueteErr, paquetes) => {
                        if (paqueteErr) {
                            res.json(paqueteErr);
                            return;
                        }

                        res.render('vacunacion_edit', {
                            data: vacunacion[0],
                            dataHato: hatos,
                            dataAnimal: animales,
                            dataPaquete: paquetes
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newVacunacion = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE vacunacion set ? WHERE idVacunacion = ?', [newVacunacion, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/vacunaciones');
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

        conn.query('DELETE FROM vacunacion WHERE idVacunacion = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/vacunaciones');
        });
    });
};

module.exports = controller;
