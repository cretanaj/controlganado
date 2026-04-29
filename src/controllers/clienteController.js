const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM cliente', (queryErr, clientes) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('clientes', {
                data: clientes
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

        conn.query('INSERT INTO cliente set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/clientes');
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

        conn.query('SELECT * FROM cliente WHERE idCliente = ?', [id], (queryErr, cliente) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('cliente_edit', {
                data: cliente[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newCliente = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE cliente set ? WHERE idCliente = ?', [newCliente, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/clientes');
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

        conn.query('DELETE FROM cliente WHERE idCliente = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/clientes');
        });
    });
};

module.exports = controller;
