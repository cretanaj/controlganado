const controller = {};

controller.list = (req, res) => {
    //res.send('hello world');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM color', (erro, colores) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
            res.render('colores', {
                data: colores
            });
        });
    });
};

controller.save = (req, res) => {
    const data = {
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('INSERT INTO color set ?',[data], (err, color) => {
            if (err) {
                return res.json(err);
            }
            console.log(color);
            res.redirect('/colores');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM color WHERE idcolor = ?',[id], (err, color) => {
            if (err) {
                return res.json(err);
            }

            if (!color || color.length === 0) {
                return res.redirect('/colores');
            }

            res.render('color_edit', {
                data: color[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newColor = {
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion
    };

    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('UPDATE color set ? WHERE idcolor = ?',[newColor,id], (err, color) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/colores');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('DELETE FROM color WHERE idcolor = ?',[id], (err, rows) => {
            if (err) {
                return res.json(err);
            }
            //rsconsole.log(color);
            res.redirect('/colores');
        });
    });
};

module.exports = controller;