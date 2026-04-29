const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT n.*, t.codigo AS codigoTipoNotificacion, t.notificacionClass
            FROM notificacion n
            LEFT JOIN tipo_notificacion t ON n.idTipoNotificacion = t.idTipoNotificacion
        `, (queryErr, notificaciones) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT * FROM tipo_notificacion', (tiposErr, tiposNotificacion) => {
                if (tiposErr) {
                    res.json(tiposErr);
                    return;
                }

                res.render('notificaciones', {
                    data: notificaciones,
                    dataTipoNotificacion: tiposNotificacion
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    ['idTipoNotificacion', 'condicionDias', 'fechaInicioDias', 'fechaFinalDias'].forEach((field) => {
        if (data[field] === '' || data[field] === null) {
            data[field] = null;
        }
    });

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO notificacion set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/notificaciones');
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

        conn.query('SELECT * FROM notificacion WHERE idNotificacion = ?', [id], (queryErr, notificacion) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            if (!notificacion || notificacion.length === 0) {
                res.status(404).json({ error: 'Notificacion no encontrada' });
                return;
            }

            conn.query('SELECT * FROM tipo_notificacion', (tiposErr, tiposNotificacion) => {
                if (tiposErr) {
                    res.json(tiposErr);
                    return;
                }

                res.render('notificacion_edit', {
                    data: notificacion[0],
                    dataTipoNotificacion: tiposNotificacion
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newNotificacion = req.body;

    ['idTipoNotificacion', 'condicionDias', 'fechaInicioDias', 'fechaFinalDias'].forEach((field) => {
        if (newNotificacion[field] === '' || newNotificacion[field] === null) {
            newNotificacion[field] = null;
        }
    });

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE notificacion set ? WHERE idNotificacion = ?', [newNotificacion, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/notificaciones');
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

        conn.query('DELETE FROM notificacion WHERE idNotificacion = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/notificaciones');
        });
    });
};

module.exports = controller;