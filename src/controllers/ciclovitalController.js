const controller = {};

controller.list = (req, res) => {
    //res.send('hello world');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ciclovital', (erro, ciclovitales) => {
            if (err) {
                //next(err); // enviarlo a un middleware de error caon express
                res.json(err);
            }
            res.render('ciclovitales', {
                data: ciclovitales
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO ciclovital set ?',[data], (err, ciclovital) => {
            console.log(ciclovital);
            res.redirect('/ciclovitales');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ciclovital WHERE idciclovital = ?',[id], (err, ciclovital) => {
            res.render('ciclovital_edit', {
                data: ciclovital[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newColor = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE ciclovital set ? WHERE idciclovital = ?',[newColor,id], (err, ciclovital) => {
            res.redirect('/ciclovitales');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM ciclovital WHERE idciclovital = ?',[id], (err, rows) => {
            res.redirect('/ciclovitales');
        });
    });
};

module.exports = controller;