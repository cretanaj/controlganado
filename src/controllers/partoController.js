const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        const partoQuery = `
            SELECT p.idParto,
                   p.idAnimalMadre,
                   p.idAnimalPadre,
                   p.idAnimalCria,
                   p.idEstadoParto,
                   p.fecha,
                   DATE_FORMAT(p.fecha, '%d-%m-%Y') AS fechaFormateada,
                   p.peso,
                   ep.nombre AS nombreEstadoParto,
                   am.codigo AS codigoMadre,
                   am.nombre AS nombreMadre,
                   ap.codigo AS codigoPadre,
                   ap.nombre AS nombrePadre,
                   ac.codigo AS codigoCria,
                   ac.nombre AS nombreCria
            FROM parto p
            LEFT JOIN estado_parto ep ON ep.idEstadoParto = p.idEstadoParto
            LEFT JOIN animal am ON am.idAnimal = p.idAnimalMadre
            LEFT JOIN animal ap ON ap.idAnimal = p.idAnimalPadre
            LEFT JOIN animal ac ON ac.idAnimal = p.idAnimalCria
            ORDER BY p.idParto DESC
        `;

        conn.query(partoQuery, (partoErr, partos) => {
            if (partoErr) {
                res.json(partoErr);
                return;
            }

            conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                if (animalErr) {
                    res.json(animalErr);
                    return;
                }

                conn.query('SELECT * FROM raza ORDER BY nombre ASC', (razaErr, razas) => {
                    if (razaErr) {
                        res.json(razaErr);
                        return;
                    }

                    conn.query('SELECT * FROM color ORDER BY nombre ASC', (colorErr, colores) => {
                        if (colorErr) {
                            res.json(colorErr);
                            return;
                        }

                        conn.query('SELECT * FROM arete ORDER BY nombre ASC', (areteErr, aretes) => {
                            if (areteErr) {
                                res.json(areteErr);
                                return;
                            }

                            conn.query('SELECT * FROM estado_parto ORDER BY nombre ASC', (estadoPartoErr, estadosParto) => {
                                if (estadoPartoErr) {
                                    res.json(estadoPartoErr);
                                    return;
                                }

                                res.render('partos', {
                                    data: partos,
                                    dataAnimal: animales,
                                    dataRaza: razas,
                                    dataColor: colores,
                                    dataArete: aretes,
                                    dataEstadoParto: estadosParto
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const {
        idAnimalMadre,
        idAnimalPadre,
        fecha,
        peso,
        codigo,
        codigoAlterno,
        idRaza,
        idColor,
        sexo,
        descripcion,
        idArete,
        idEstadoParto
    } = req.body;

    if (!idAnimalMadre || !idAnimalPadre || !fecha || !peso || !codigo || !idRaza || !idColor || !sexo || !idEstadoParto) {
        res.status(400).json({
            message: 'Faltan datos requeridos para registrar el parto y la cria.'
        });
        return;
    }

    const normalizeEmpty = (value) => {
        if (value === undefined || value === null) {
            return null;
        }
        return String(value).trim() === '' ? null : value;
    };

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'CALL sp_registrar_parto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                idAnimalMadre,
                idAnimalPadre,
                idEstadoParto,
                fecha,
                peso,
                codigo,
                normalizeEmpty(codigoAlterno),
                idRaza,
                idColor,
                sexo,
                normalizeEmpty(descripcion),
                normalizeEmpty(idArete)
            ],
            (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/partos');
            }
        );
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        const editQuery = `
            SELECT p.idParto,
                   p.idAnimalMadre,
                   p.idAnimalPadre,
                   p.idAnimalCria,
                     p.idEstadoParto,
                   p.fecha,
                   DATE_FORMAT(p.fecha, '%Y-%m-%d') AS ymdFecha,
                   p.peso
            FROM parto p
            WHERE p.idParto = ?
        `;

        conn.query(editQuery, [id], (partoErr, partoRows) => {
            if (partoErr) {
                res.json(partoErr);
                return;
            }

            if (!partoRows || partoRows.length === 0) {
                res.redirect('/partos');
                return;
            }

            conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                if (animalErr) {
                    res.json(animalErr);
                    return;
                }

                conn.query('SELECT * FROM estado_parto ORDER BY nombre ASC', (estadoPartoErr, estadosParto) => {
                    if (estadoPartoErr) {
                        res.json(estadoPartoErr);
                        return;
                    }

                    res.render('parto_edit', {
                        data: partoRows[0],
                        dataAnimal: animales,
                        dataEstadoParto: estadosParto
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newParto = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE parto set ? WHERE idParto = ?', [newParto, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }

            res.redirect('/partos');
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

        conn.query('DELETE FROM parto WHERE idParto = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }

            res.redirect('/partos');
        });
    });
};

module.exports = controller;