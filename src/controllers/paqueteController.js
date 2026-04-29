const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM paquete', (queryErr, paquetes) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('paquetes', {
                data: paquetes
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

        conn.query('INSERT INTO paquete set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/paquetes');
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

        conn.query('SELECT * FROM paquete WHERE idPaquete = ?', [id], (queryErr, paquete) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('paquete_edit', {
                data: paquete[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newPaquete = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE paquete set ? WHERE idPaquete = ?', [newPaquete, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/paquetes');
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

        conn.query('DELETE FROM paquete WHERE idPaquete = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/paquetes');
        });
    });
};

module.exports = controller;
