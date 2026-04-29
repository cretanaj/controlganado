const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM proveedor', (queryErr, proveedores) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('proveedores', {
                data: proveedores
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

        conn.query('INSERT INTO proveedor set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/proveedores');
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

        conn.query('SELECT * FROM proveedor WHERE idProveedor = ?', [id], (queryErr, proveedor) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('proveedor_edit', {
                data: proveedor[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newProveedor = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE proveedor set ? WHERE idProveedor = ?', [newProveedor, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/proveedores');
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

        conn.query('DELETE FROM proveedor WHERE idProveedor = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/proveedores');
        });
    });
};

module.exports = controller;
