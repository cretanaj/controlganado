const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT *
            FROM _vw_pesajes
            ORDER BY idAnimal ASC, idHato ASC, fecha ASC, idPesaje ASC
        `, (queryErr, pesajes) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idHato, nombre FROM hato ORDER BY nombre', (hatoErr, hatos) => {
                if (hatoErr) {
                    res.json(hatoErr);
                    return;
                }

                conn.query('SELECT idAnimal, codigo, nombre, idHato FROM animal ORDER BY codigo ASC', (animalErr, animales) => {
                    if (animalErr) {
                        res.json(animalErr);
                        return;
                    }

                    res.render('pesajes', {
                        data: pesajes,
                        dataHato: hatos,
                        dataAnimal: animales
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    const peso = Number(data.pesoKg);

    if (!Number.isFinite(peso) || peso <= 0) {
        res.redirect('/pesajes');
        return;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO pesaje set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/pesajes');
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

        conn.query('DELETE FROM pesaje WHERE idPesaje = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/pesajes');
        });
    });
};

module.exports = controller;
