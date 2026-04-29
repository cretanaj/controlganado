const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT *
            FROM _vw_notificaciones
            ORDER BY idNotificacion ASC, idAnimal ASC
        `, (queryErr, notificaciones) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            res.render('notificaciones_resumen', {
                data: notificaciones
            });
        });
    });
};

module.exports = controller;
