const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query(`
            SELECT c.*, f.nombre AS nombreFinca
            FROM colaborador c
            LEFT JOIN finca f ON c.idFinca = f.idFinca
        `, (queryErr, colaboradores) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            conn.query('SELECT idFinca, nombre FROM finca ORDER BY nombre', (fincasErr, fincas) => {
                if (fincasErr) {
                    res.json(fincasErr);
                    return;
                }

                res.render('colaboradores', {
                    data: colaboradores,
                    dataFincas: fincas
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.idFinca === '' || data.idFinca === null) {
        data.idFinca = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO colaborador set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/colaboradores');
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

        conn.query('SELECT * FROM colaborador WHERE idColaborador = ?', [id], (queryErr, colaborador) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            conn.query('SELECT idFinca, nombre FROM finca ORDER BY nombre', (fincasErr, fincas) => {
                if (fincasErr) {
                    res.json(fincasErr);
                    return;
                }

                res.render('colaborador_edit', {
                    data: colaborador[0],
                    dataFincas: fincas
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newColaborador = req.body;

    if (newColaborador.idFinca === '' || newColaborador.idFinca === null) {
        newColaborador.idFinca = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE colaborador set ? WHERE idColaborador = ?', [newColaborador, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/colaboradores');
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

        conn.query('DELETE FROM colaborador WHERE idColaborador = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/colaboradores');
        });
    });
};

module.exports = controller;
