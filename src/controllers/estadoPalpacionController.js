const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM estado_palpacion', (erro, estadosPalpacion) => {
            if (err) {
                res.json(err);
            }
            res.render('estado_palpaciones', {
                data: estadosPalpacion
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO estado_palpacion set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/estado_palpaciones');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM estado_palpacion WHERE idEstadoPalpacion = ?', [id], (queryErr, estadoPalpacion) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('estado_palpacion_edit', {
                data: estadoPalpacion[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newEstadoPalpacion = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE estado_palpacion set ? WHERE idEstadoPalpacion = ?', [newEstadoPalpacion, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/estado_palpaciones');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM estado_palpacion WHERE idEstadoPalpacion = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/estado_palpaciones');
        });
    });
};

module.exports = controller;