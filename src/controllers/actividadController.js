const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM actividad ORDER BY nombre ASC', (queryErr, actividades) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('actividades', {
                data: actividades
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

        conn.query('INSERT INTO actividad set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/actividades');
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

        conn.query('SELECT * FROM actividad WHERE idActividad = ?', [id], (queryErr, actividad) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('actividad_edit', {
                data: actividad[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newActividad = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE actividad set ? WHERE idActividad = ?', [newActividad, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/actividades');
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

        conn.query('DELETE FROM actividad WHERE idActividad = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/actividades');
        });
    });
};

module.exports = controller;
