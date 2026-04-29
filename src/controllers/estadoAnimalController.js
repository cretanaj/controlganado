const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM estado_animal', (queryErr, estadosAnimal) => {
            if (err || queryErr) {
                res.json(err || queryErr);
                return;
            }
            res.render('estado_animales', {
                data: estadosAnimal
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

        conn.query('INSERT INTO estado_animal set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/estado_animales');
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

        conn.query('SELECT * FROM estado_animal WHERE idEstadoAnimal = ?', [id], (queryErr, estadoAnimal) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }
            res.render('estado_animal_edit', {
                data: estadoAnimal[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newEstadoAnimal = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE estado_animal set ? WHERE idEstadoAnimal = ?', [newEstadoAnimal, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/estado_animales');
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

        conn.query('DELETE FROM estado_animal WHERE idEstadoAnimal = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/estado_animales');
        });
    });
};

module.exports = controller;
