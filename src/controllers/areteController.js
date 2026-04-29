const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM arete', (err, aretes) => {
            if (err) {
                res.json(err);
            }
            res.render('aretes', {
                data: aretes
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO arete set ?', [data], (err, arete) => {
            res.redirect('/aretes');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM arete WHERE idArete = ?', [id], (err, arete) => {
            res.render('arete_edit', {
                data: arete[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newArete = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE arete set ? WHERE idArete = ?', [newArete, id], (err, rows) => {
            res.redirect('/aretes');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM arete WHERE idArete = ?', [id], (err, rows) => {
            res.redirect('/aretes');
        });
    });
};

module.exports = controller;