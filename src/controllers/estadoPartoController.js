const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM estado_parto', (queryErr, estadosParto) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('estado_partos', {
                data: estadosParto
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

        conn.query('INSERT INTO estado_parto set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/estado_partos');
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

        conn.query('SELECT * FROM estado_parto WHERE idEstadoParto = ?', [id], (queryErr, estadoParto) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('estado_parto_edit', {
                data: estadoParto[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newEstadoParto = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE estado_parto set ? WHERE idEstadoParto = ?', [newEstadoParto, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/estado_partos');
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

        conn.query('DELETE FROM estado_parto WHERE idEstadoParto = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/estado_partos');
        });
    });
};

module.exports = controller;