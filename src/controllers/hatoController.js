const controller = {};

controller.list = (req, res) => {
    //res.send('hello world');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM hato', (erro, hatos) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
            res.render('hatos', {
                data: hatos
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO hato set ?',[data], (err, hato) => {
            console.log(hato);
            res.redirect('/hatos');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM hato WHERE idHato = ?',[id], (err, hato) => {
            res.render('hato_edit', {
                data: hato[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newHato = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE hato set ? WHERE idHato = ?',[newHato,id], (err, hato) => {
            res.redirect('/hatos');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM hato WHERE idHato = ?',[id], (err, rows) => {
            res.redirect('/hatos');
        });
    });
};

module.exports = controller;