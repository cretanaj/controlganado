const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('SELECT * FROM enfermedad ORDER BY codigo, nombre', (queryErr, enfermedades) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('enfermedades', {
                data: enfermedades
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

        conn.query('INSERT INTO enfermedad set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/enfermedades');
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

        conn.query('SELECT * FROM enfermedad WHERE idEnfermedad = ?', [id], (queryErr, enfermedad) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('enfermedad_edit', {
                data: enfermedad[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newEnfermedad = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE enfermedad set ? WHERE idEnfermedad = ?', [newEnfermedad, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/enfermedades');
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

        conn.query('DELETE FROM enfermedad WHERE idEnfermedad = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/enfermedades');
        });
    });
};

module.exports = controller;
