const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                c.idCelo,
                c.idAnimalVaca,
                c.idAnimalToro,
                c.fechaInicio,
                c.fechaFin,
                c.observacion,
                CONCAT(DATE_FORMAT(c.fechaInicio, '%m/%d/%Y'), ' GMT-6 CST') AS fechaInicioFormateada,
                IF(c.fechaFin IS NULL, '', CONCAT(DATE_FORMAT(c.fechaFin, '%m/%d/%Y'), ' GMT-6 CST')) AS fechaFinFormateada,
                av.codigo AS codigoVaca,
                av.nombre AS nombreVaca,
                at.codigo AS codigoToro,
                at.nombre AS nombreToro
            FROM celo c
            INNER JOIN animal av ON av.idAnimal = c.idAnimalVaca
            INNER JOIN animal at ON at.idAnimal = c.idAnimalToro
            ORDER BY c.fechaInicio DESC, c.idCelo DESC
        `, (listErr, celos) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query(`
                SELECT idAnimal, codigo, nombre
                FROM animal
                WHERE TRIM(UPPER(IFNULL(sexo, ''))) IN ('HEMBRA', 'H', 'F')
                ORDER BY codigo ASC
            `, (vacasErr, vacas) => {
                if (vacasErr) {
                    res.json(vacasErr);
                    return;
                }

                conn.query(`
                    SELECT idAnimal, codigo, nombre
                    FROM animal
                    WHERE TRIM(UPPER(IFNULL(sexo, ''))) IN ('MACHO', 'M')
                    ORDER BY codigo ASC
                `, (torosErr, toros) => {
                    if (torosErr) {
                        res.json(torosErr);
                        return;
                    }

                    res.render('celos', {
                        data: celos,
                        dataVacas: vacas,
                        dataToros: toros
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.fechaFin === '' || data.fechaFin === null) {
        data.fechaFin = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO celo set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/celos');
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
                c.*,
                DATE_FORMAT(c.fechaInicio, '%Y-%m-%d') AS ymdFechaInicio,
                DATE_FORMAT(c.fechaFin, '%Y-%m-%d') AS ymdFechaFin
            FROM celo c
            WHERE c.idCelo = ?
        `, [id], (celoErr, celos) => {
            if (celoErr) {
                res.json(celoErr);
                return;
            }

            if (!celos || celos.length === 0) {
                res.redirect('/celos');
                return;
            }

            conn.query(`
                SELECT idAnimal, codigo, nombre
                FROM animal
                WHERE TRIM(UPPER(IFNULL(sexo, ''))) IN ('HEMBRA', 'H', 'F')
                ORDER BY codigo ASC
            `, (vacasErr, vacas) => {
                if (vacasErr) {
                    res.json(vacasErr);
                    return;
                }

                conn.query(`
                    SELECT idAnimal, codigo, nombre
                    FROM animal
                    WHERE TRIM(UPPER(IFNULL(sexo, ''))) IN ('MACHO', 'M')
                    ORDER BY codigo ASC
                `, (torosErr, toros) => {
                    if (torosErr) {
                        res.json(torosErr);
                        return;
                    }

                    res.render('celo_edit', {
                        data: celos[0],
                        dataVacas: vacas,
                        dataToros: toros
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newCelo = req.body;

    if (newCelo.fechaFin === '' || newCelo.fechaFin === null) {
        newCelo.fechaFin = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE celo set ? WHERE idCelo = ?', [newCelo, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/celos');
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

        conn.query('DELETE FROM celo WHERE idCelo = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/celos');
        });
    });
};

module.exports = controller;
