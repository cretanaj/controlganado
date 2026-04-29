const controller = {};

controller.historicoEnfermedades = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM _vw_rpt_01_enfermedades_historicas_por_animal', (queryErr, rows) => {
            if (queryErr) {
                return res.json(queryErr);
            }

            res.render('reportes_historico_enfermedades', {
                data: rows
            });
        });
    });
};

controller.animalesProntosCelo = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM _vw_rpt_02_animales_prontos_celo', (queryErr, rows) => {
            if (queryErr) {
                return res.json(queryErr);
            }

            res.render('reportes_animales_prontos_celo', {
                data: rows
            });
        });
    });
};

controller.periodoGestacionObjetivoAnual = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM _vw_rpt_03_periodo_gestacion_y_objetivo_anual', (queryErr, rows) => {
            if (queryErr) {
                return res.json(queryErr);
            }

            res.render('reportes_periodo_gestacion_objetivo_anual', {
                data: rows
            });
        });
    });
};

controller.kgDiaAnimalPromedioHato = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM _vw_rpt_04_kg_dia_animal_promedio_hato', (queryErr, rows) => {
            if (queryErr) {
                return res.json(queryErr);
            }

            res.render('reportes_kg_dia_animal_promedio_hato', {
                data: rows
            });
        });
    });
};

controller.consanguinidadPorHato = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }

        conn.query('SELECT * FROM _vw_rpt_05_consanguinidad_por_hato', (queryErr, rows) => {
            if (queryErr) {
                return res.json(queryErr);
            }

            res.render('reportes_consanguinidad_por_hato', {
                data: rows
            });
        });
    });
};

module.exports = controller;