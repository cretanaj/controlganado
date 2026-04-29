const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                ca.idActividad,
                ca.idPaquete,
                a.codigo AS codigoActividad,
                a.nombre AS nombreActividad,
                p.codigo AS codigoPaquete,
                p.nombre AS nombrePaquete
            FROM control_actividad ca
            INNER JOIN actividad a ON ca.idActividad = a.idActividad
            INNER JOIN paquete p ON ca.idPaquete = p.idPaquete
            ORDER BY a.nombre, p.nombre
        `, (listErr, controles) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query('SELECT idActividad, codigo, nombre FROM actividad ORDER BY codigo, nombre, idActividad', (actErr, actividades) => {
                if (actErr) {
                    res.json(actErr);
                    return;
                }

                conn.query('SELECT idPaquete, codigo, nombre FROM paquete ORDER BY codigo, nombre, idPaquete', (paqErr, paquetes) => {
                    if (paqErr) {
                        res.json(paqErr);
                        return;
                    }

                    res.render('control_actividades', {
                        data: controles,
                        dataActividades: actividades,
                        dataPaquetes: paquetes
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

        conn.query('INSERT IGNORE INTO control_actividad set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/control_actividades');
        });
    });
};

controller.delete = (req, res) => {
    const { idActividad, idPaquete } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'DELETE FROM control_actividad WHERE idActividad = ? AND idPaquete = ?',
            [idActividad, idPaquete],
            (deleteErr) => {
                if (deleteErr) {
                    res.json(deleteErr);
                    return;
                }
                res.redirect('/control_actividades');
            }
        );
    });
};

module.exports = controller;
