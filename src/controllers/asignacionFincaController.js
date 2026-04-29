const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                af.idPerfil,
                af.idFinca,
                af.fecha,
                DATE_FORMAT(af.fecha, '%d-%m-%Y') AS fechaFormateada,
                p.codigo AS codigoPerfil,
                p.nombre AS nombrePerfil,
                f.codigo AS codigoFinca,
                f.nombre AS nombreFinca
            FROM asignacion_finca af
            INNER JOIN perfil p ON af.idPerfil = p.idPerfil
            INNER JOIN finca f ON af.idFinca = f.idFinca
            ORDER BY af.fecha DESC, p.nombre, f.nombre
        `, (listErr, asignaciones) => {
            if (listErr) {
                res.json(listErr);
                return;
            }

            conn.query('SELECT idPerfil, codigo, nombre FROM perfil ORDER BY codigo, nombre, idPerfil', (perfilErr, perfiles) => {
                if (perfilErr) {
                    res.json(perfilErr);
                    return;
                }

                conn.query('SELECT idFinca, codigo, nombre FROM finca ORDER BY codigo, nombre, idFinca', (fincaErr, fincas) => {
                    if (fincaErr) {
                        res.json(fincaErr);
                        return;
                    }

                    res.render('asignacion_fincas', {
                        data: asignaciones,
                        dataPerfiles: perfiles,
                        dataFincas: fincas
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = {
        idPerfil: req.body.idPerfil,
        idFinca: req.body.idFinca
    };

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT IGNORE INTO asignacion_finca set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/asignacion_fincas');
        });
    });
};

controller.delete = (req, res) => {
    const { idPerfil, idFinca } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(
            'DELETE FROM asignacion_finca WHERE idPerfil = ? AND idFinca = ?',
            [idPerfil, idFinca],
            (deleteErr) => {
                if (deleteErr) {
                    res.json(deleteErr);
                    return;
                }
                res.redirect('/asignacion_fincas');
            }
        );
    });
};

module.exports = controller;
