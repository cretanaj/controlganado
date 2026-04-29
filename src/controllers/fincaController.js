const controller = {};

controller.list = (req, res) => {
    //res.send('hello world');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM finca', (erro, fincas) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
            res.render('fincas', {
                data: fincas
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO finca set ?',[data], (err, finca) => {
            console.log(finca);
            res.redirect('/fincas');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM finca WHERE idFinca = ?',[id], (err, finca) => {
            res.render('finca_edit', {
                data: finca[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newFinca = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE finca set ? WHERE idFinca = ?',[newFinca,id], (err, finca) => {
            res.redirect('/fincas');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM finca WHERE idFinca = ?',[id], (err, rows) => {
            res.redirect('/fincas');
        });
    });
};

module.exports = controller;