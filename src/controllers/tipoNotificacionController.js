const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('SELECT * FROM tipo_notificacion', (queryErr, tiposNotificacion) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            res.render('tipo_notificaciones', {
                data: tiposNotificacion
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

        conn.query('INSERT INTO tipo_notificacion set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }

            res.redirect('/tipo_notificaciones');
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

        conn.query('SELECT * FROM tipo_notificacion WHERE idTipoNotificacion = ?', [id], (queryErr, tipoNotificacion) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            if (!tipoNotificacion || tipoNotificacion.length === 0) {
                res.status(404).json({ error: 'Tipo de notificacion no encontrado' });
                return;
            }

            res.render('tipo_notificacion_edit', {
                data: tipoNotificacion[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newTipoNotificacion = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE tipo_notificacion set ? WHERE idTipoNotificacion = ?', [newTipoNotificacion, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }

            res.redirect('/tipo_notificaciones');
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

        conn.query('DELETE FROM tipo_notificacion WHERE idTipoNotificacion = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }

            res.redirect('/tipo_notificaciones');
        });
    });
};

module.exports = controller;