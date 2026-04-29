const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                t.*,
                CONCAT(DATE_FORMAT(t.fecha, '%m/%d/%Y'), ' GMT-6 CST') AS fechaFormateada,
                IF(t.fechaFinalizacion IS NULL, '', CONCAT(DATE_FORMAT(t.fechaFinalizacion, '%m/%d/%Y'), ' GMT-6 CST')) AS fechaFinalizacionFormateada,
                a.codigo AS codigoActividad,
                a.nombre AS nombreActividad,
                u.codigo AS codigoUsuario,
                u.nombreUsuario,
                et.codigo AS codigoEstadoTarea,
                et.nombre AS nombreEstadoTarea
            FROM tarea t
            LEFT JOIN actividad a ON t.idActividad = a.idActividad
            LEFT JOIN usuario u ON t.idUser = u.idUsuario
            LEFT JOIN estado_tarea et ON t.idEstadoTarea = et.idEstadoTarea
            ORDER BY t.fecha DESC, t.idTarea DESC
        `, (queryErr, tareas) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idActividad, codigo, nombre FROM actividad ORDER BY codigo, nombre', (actErr, actividades) => {
                if (actErr) {
                    res.json(actErr);
                    return;
                }

                conn.query('SELECT idUsuario, codigo, nombreUsuario, nombreCompleto FROM usuario ORDER BY codigo, nombreUsuario', (usrErr, usuarios) => {
                    if (usrErr) {
                        res.json(usrErr);
                        return;
                    }

                    conn.query('SELECT idEstadoTarea, codigo, nombre FROM estado_tarea ORDER BY codigo, nombre', (estErr, estadosTarea) => {
                        if (estErr) {
                            res.json(estErr);
                            return;
                        }

                        res.render('tareas', {
                            data: tareas,
                            dataActividad: actividades,
                            dataUsuario: usuarios,
                            dataEstadoTarea: estadosTarea
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

        conn.query('INSERT INTO tarea set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/tareas');
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
                t.*,
                DATE_FORMAT(t.fecha, '%Y-%m-%d') AS ymdFecha,
                DATE_FORMAT(t.fechaFinalizacion, '%Y-%m-%d') AS ymdFechaFinalizacion
            FROM tarea t
            WHERE t.idTarea = ?
        `, [id], (queryErr, tarea) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idActividad, codigo, nombre FROM actividad ORDER BY codigo, nombre', (actErr, actividades) => {
                if (actErr) {
                    res.json(actErr);
                    return;
                }

                conn.query('SELECT idUsuario, codigo, nombreUsuario, nombreCompleto FROM usuario ORDER BY codigo, nombreUsuario', (usrErr, usuarios) => {
                    if (usrErr) {
                        res.json(usrErr);
                        return;
                    }

                    conn.query('SELECT idEstadoTarea, codigo, nombre FROM estado_tarea ORDER BY codigo, nombre', (estErr, estadosTarea) => {
                        if (estErr) {
                            res.json(estErr);
                            return;
                        }

                        res.render('tarea_edit', {
                            data: tarea[0],
                            dataActividad: actividades,
                            dataUsuario: usuarios,
                            dataEstadoTarea: estadosTarea
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newTarea = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE tarea set ? WHERE idTarea = ?', [newTarea, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/tareas');
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

        conn.query('DELETE FROM tarea WHERE idTarea = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/tareas');
        });
    });
};

module.exports = controller;
