const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        const palpacionQuery = 'SELECT * FROM _vw_palpaciones ORDER BY idPalpacion DESC';

        conn.query(palpacionQuery, (palpacionErr, palpaciones) => {
            if (palpacionErr) {
                res.json(palpacionErr);
                return;
            }

            conn.query('SELECT idAnimal, codigo, nombre, idHato FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                if (animalErr) {
                    res.json(animalErr);
                    return;
                }

                conn.query('SELECT idHato, nombre FROM hato ORDER BY nombre ASC', (hatoErr, hatos) => {
                    if (hatoErr) {
                        res.json(hatoErr);
                        return;
                    }

                    conn.query('SELECT idEstadoPalpacion, nombre FROM estado_palpacion ORDER BY nombre ASC', (estadoErr, estados) => {
                        if (estadoErr) {
                            res.json(estadoErr);
                            return;
                        }

                        conn.query('SELECT idVeterinario, nombre FROM veterinario ORDER BY nombre ASC', (veterinarioErr, veterinarios) => {
                            if (veterinarioErr) {
                                res.json(veterinarioErr);
                                return;
                            }

                            res.render('palpaciones', {
                                data: palpaciones,
                                dataAnimal: animales,
                                dataHato: hatos,
                                dataEstadoPalpacion: estados,
                                dataVeterinario: veterinarios
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
        idAnimalVaca,
        idHato,
        fecha,
        idEstadoPalpacion,
        resultadoPrenez,
        idVeterinario,
        descripcion
    } = req.body;

    const animalIds = Array.isArray(idAnimalVaca)
        ? idAnimalVaca
        : (idAnimalVaca ? [idAnimalVaca] : []);

    const sanitizedAnimalIds = animalIds.filter((animalId) => String(animalId).trim() !== '');

    if (!fecha || sanitizedAnimalIds.length === 0) {
        res.status(400).json({
            message: 'Debe seleccionar al menos un animal y una fecha.'
        });
        return;
    }

    const normalizeEmpty = (value) => {
        if (value === undefined || value === null) {
            return null;
        }
        return String(value).trim() === '' ? null : value;
    };

    const normalizedData = {
        idHato: normalizeEmpty(idHato),
        idEstadoPalpacion: normalizeEmpty(idEstadoPalpacion),
        resultadoPrenez: normalizeEmpty(resultadoPrenez),
        descripcion: normalizeEmpty(descripcion),
        idVeterinario: normalizeEmpty(idVeterinario)
    };

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.beginTransaction((txErr) => {
            if (txErr) {
                res.json(txErr);
                return;
            }

            const insertOne = (index) => {
                if (index >= sanitizedAnimalIds.length) {
                    conn.commit((commitErr) => {
                        if (commitErr) {
                            conn.rollback(() => {
                                res.json(commitErr);
                            });
                            return;
                        }
                        res.redirect('/palpaciones');
                    });
                    return;
                }

                conn.query(
                    'CALL sp_registrar_palpacion(?, ?, ?, ?, ?, ?, ?)',
                    [
                        sanitizedAnimalIds[index],
                        normalizedData.idHato,
                        fecha,
                        normalizedData.idEstadoPalpacion,
                        normalizedData.resultadoPrenez,
                        normalizedData.descripcion,
                        normalizedData.idVeterinario
                    ],
                    (saveErr) => {
                        if (saveErr) {
                            conn.rollback(() => {
                                res.json(saveErr);
                            });
                            return;
                        }

                        insertOne(index + 1);
                    }
                );
            };

            insertOne(0);
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

        const editQuery = `
            SELECT p.idPalpacion,
                   p.idAnimalVaca,
                   p.idHato,
                   p.fecha,
                   DATE_FORMAT(p.fecha, '%Y-%m-%d') AS ymdFecha,
                   p.idEstadoPalpacion,
                   p.resultadoPrenez,
                   p.descripcion,
                   p.idVeterinario
            FROM palpacion p
            WHERE p.idPalpacion = ?
        `;

        conn.query(editQuery, [id], (palpacionErr, palpacionRows) => {
            if (palpacionErr) {
                res.json(palpacionErr);
                return;
            }

            if (!palpacionRows || palpacionRows.length === 0) {
                res.redirect('/palpaciones');
                return;
            }

            conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                if (animalErr) {
                    res.json(animalErr);
                    return;
                }

                conn.query('SELECT idHato, nombre FROM hato ORDER BY nombre ASC', (hatoErr, hatos) => {
                    if (hatoErr) {
                        res.json(hatoErr);
                        return;
                    }

                    conn.query('SELECT idEstadoPalpacion, nombre FROM estado_palpacion ORDER BY nombre ASC', (estadoErr, estados) => {
                        if (estadoErr) {
                            res.json(estadoErr);
                            return;
                        }

                        conn.query('SELECT idVeterinario, nombre FROM veterinario ORDER BY nombre ASC', (veterinarioErr, veterinarios) => {
                            if (veterinarioErr) {
                                res.json(veterinarioErr);
                                return;
                            }

                            res.render('palpacion_edit', {
                                data: palpacionRows[0],
                                dataAnimal: animales,
                                dataHato: hatos,
                                dataEstadoPalpacion: estados,
                                dataVeterinario: veterinarios
                            });
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newPalpacion = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE palpacion set ? WHERE idPalpacion = ?', [newPalpacion, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }

            res.redirect('/palpaciones');
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

        conn.query('DELETE FROM palpacion WHERE idPalpacion = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }

            res.redirect('/palpaciones');
        });
    });
};

module.exports = controller;
