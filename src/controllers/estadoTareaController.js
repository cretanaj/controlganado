const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM estado_tarea', (queryErr, estadosTarea) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('estado_tareas', {
                data: estadosTarea
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

        conn.query('INSERT INTO estado_tarea set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/estado_tareas');
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

        conn.query('SELECT * FROM estado_tarea WHERE idEstadoTarea = ?', [id], (queryErr, estadoTarea) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('estado_tarea_edit', {
                data: estadoTarea[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newEstadoTarea = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE estado_tarea set ? WHERE idEstadoTarea = ?', [newEstadoTarea, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/estado_tareas');
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

        conn.query('DELETE FROM estado_tarea WHERE idEstadoTarea = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/estado_tareas');
        });
    });
};

module.exports = controller;
