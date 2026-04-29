const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                sb.idAnimal,
                sb.idEnfermedad,
                sb.idPaquete,
                a.codigo AS codigoAnimal,
                a.nombre AS nombreAnimal,
                e.codigo AS codigoEnfermedad,
                e.nombre AS nombreEnfermedad,
                p.codigo AS codigoPaquete,
                p.nombre AS nombrePaquete
            FROM sintomas_bovinos sb
            INNER JOIN animal a ON sb.idAnimal = a.idAnimal
            INNER JOIN enfermedad e ON sb.idEnfermedad = e.idEnfermedad
            INNER JOIN paquete p ON sb.idPaquete = p.idPaquete
            ORDER BY a.codigo, e.codigo, p.codigo
        `, (listErr, sintomas) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo, nombre', (animalErr, animales) => {
                if (animalErr) {
                    res.json(animalErr);
                    return;
                }

                conn.query('SELECT idEnfermedad, codigo, nombre FROM enfermedad ORDER BY codigo, nombre', (enfErr, enfermedades) => {
                    if (enfErr) {
                        res.json(enfErr);
                        return;
                    }

                    conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre', (paqErr, paquetes) => {
                        if (paqErr) {
                            res.json(paqErr);
                            return;
                        }

                        res.render('sintomas_bovinos', {
                            data: sintomas,
                            dataAnimales: animales,
                            dataEnfermedades: enfermedades,
                            dataPaquetes: paquetes
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

        conn.query('INSERT IGNORE INTO sintomas_bovinos set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/sintomas_bovinos');
        });
    });
};

controller.delete = (req, res) => {
    const { idAnimal, idEnfermedad, idPaquete } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'DELETE FROM sintomas_bovinos WHERE idAnimal = ? AND idEnfermedad = ? AND idPaquete = ?',
            [idAnimal, idEnfermedad, idPaquete],
            (deleteErr) => {
                if (deleteErr) {
                    res.json(deleteErr);
                    return;
                }
                res.redirect('/sintomas_bovinos');
            }
        );
    });
};

module.exports = controller;
