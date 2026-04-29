const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('SELECT * FROM perfil ORDER BY codigo, nombre', (queryErr, perfiles) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            res.render('perfiles', {
                data: perfiles
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

        conn.query('INSERT INTO perfil set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/perfiles');
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

        conn.query('SELECT * FROM perfil WHERE idPerfil = ?', [id], (queryErr, perfil) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            res.render('perfil_edit', {
                data: perfil[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newPerfil = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE perfil set ? WHERE idPerfil = ?', [newPerfil, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/perfiles');
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

        conn.query('DELETE FROM perfil WHERE idPerfil = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/perfiles');
        });
    });
};

module.exports = controller;
