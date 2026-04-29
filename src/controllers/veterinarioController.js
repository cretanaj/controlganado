const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM veterinario', (queryErr, veterinarios) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('veterinarios', {
                data: veterinarios
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

        conn.query('INSERT INTO veterinario set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/veterinarios');
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

        conn.query('SELECT * FROM veterinario WHERE idVeterinario = ?', [id], (queryErr, veterinario) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('veterinario_edit', {
                data: veterinario[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newVeterinario = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE veterinario set ? WHERE idVeterinario = ?', [newVeterinario, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/veterinarios');
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

        conn.query('DELETE FROM veterinario WHERE idVeterinario = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/veterinarios');
        });
    });
};

module.exports = controller;
