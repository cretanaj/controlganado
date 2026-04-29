const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                p.*,
                IF(p.fechaCompra IS NULL, '', CONCAT(DATE_FORMAT(p.fechaCompra, '%m/%d/%Y'), ' GMT-6 CST')) AS fechaCompraFormateada,
                IF(p.fechaFabricacion IS NULL, '', CONCAT(DATE_FORMAT(p.fechaFabricacion, '%m/%d/%Y'), ' GMT-6 CST')) AS fechaFabricacionFormateada,
                IF(p.fechaCaducidad IS NULL, '', CONCAT(DATE_FORMAT(p.fechaCaducidad, '%m/%d/%Y'), ' GMT-6 CST')) AS fechaCaducidadFormateada,
                pr.nombre AS nombreProveedor
            FROM producto p
            LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
        `, (queryErr, productos) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idProveedor, nombre FROM proveedor ORDER BY nombre', (provErr, proveedores) => {
                if (provErr) {
                    res.json(provErr);
                    return;
                }

                res.render('productos', {
                    data: productos,
                    dataProveedores: proveedores
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.idProveedor === '' || data.idProveedor === null) {
        data.idProveedor = null;
    }
    if (data.cantidad === '' || data.cantidad === null) {
        data.cantidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO producto set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/productos');
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

        conn.query(`
            SELECT
                p.*,
                DATE_FORMAT(p.fechaCompra, '%Y-%m-%d') AS fechaCompraFmt,
                DATE_FORMAT(p.fechaFabricacion, '%Y-%m-%d') AS fechaFabricacionFmt,
                DATE_FORMAT(p.fechaCaducidad, '%Y-%m-%d') AS fechaCaducidadFmt
            FROM producto p
            WHERE p.idProducto = ?
        `, [id], (queryErr, producto) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idProveedor, nombre FROM proveedor ORDER BY nombre', (provErr, proveedores) => {
                if (provErr) {
                    res.json(provErr);
                    return;
                }

                res.render('producto_edit', {
                    data: producto[0],
                    dataProveedores: proveedores
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newProducto = req.body;

    if (newProducto.idProveedor === '' || newProducto.idProveedor === null) {
        newProducto.idProveedor = null;
    }
    if (newProducto.cantidad === '' || newProducto.cantidad === null) {
        newProducto.cantidad = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE producto set ? WHERE idProducto = ?', [newProducto, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/productos');
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

        conn.query('DELETE FROM producto WHERE idProducto = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/productos');
        });
    });
};

module.exports = controller;
