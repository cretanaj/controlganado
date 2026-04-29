const controller = {};

controller.list = (req, res) => {
    //res.send('hello world');
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM raza', (erro, razas) => {
            if (erro) {
                //next(err); // enviarlo a un middleware de error caon express
                return res.json(erro);
            }
            res.render('razas', {
                data: razas
            });
        });
    });
};

controller.save = (req, res) => {
    const data = {
        nombre: req.body.nombre,
        codigo: req.body.codigo
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('INSERT INTO raza set ?',[data], (err, raza) => {
            if (err) {
                return res.json(err);
            }

            console.log(raza);
            res.redirect('/razas');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM raza WHERE idraza = ?',[id], (err, raza) => {
            if (err) {
                return res.json(err);
            }

            if (!raza || raza.length === 0) {
                return res.redirect('/razas');
            }

            res.render('raza_edit', {
                data: raza[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newRaza = {
        nombre: req.body.nombre,
        codigo: req.body.codigo
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('UPDATE raza set ? WHERE idraza = ?',[newRaza,id], (err, raza) => {
            if (err) {
                return res.json(err);
            }

            res.redirect('/razas');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('DELETE FROM raza WHERE idraza = ?',[id], (err, rows) => {
            if (err) {
                return res.json(err);
            }

            res.redirect('/razas');
        });
    });
};

module.exports = controller;