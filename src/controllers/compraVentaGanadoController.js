const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query(`
            SELECT
                cvg.*,
                DATE_FORMAT(cvg.fechaCompra, '%Y-%m-%d') AS ymdFechaCompra,
                DATE_FORMAT(cvg.fechaVenta, '%Y-%m-%d') AS ymdFechaVenta,
                DATE_FORMAT(cvg.fechaCompra, '%d/%m/%Y') AS fechaCompraCR,
                DATE_FORMAT(cvg.fechaVenta, '%d/%m/%Y') AS fechaVentaCR,
                p.nombre AS nombreProveedor,
                c.nombre AS nombreCliente,
                a.codigo AS codigoAnimal,
                a.nombre AS nombreAnimal
            FROM compra_venta_ganado cvg
            LEFT JOIN proveedor p ON p.idProveedor = cvg.idProveedor
            LEFT JOIN cliente c ON c.idCliente = cvg.idCliente
            LEFT JOIN animal a ON a.idAnimal = cvg.idAnimal
            ORDER BY cvg.idCompraVentaGanado DESC
        `, (queryErr, comprasVentas) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idProveedor, codigo, nombre FROM proveedor ORDER BY codigo, nombre', (provErr, proveedores) => {
                if (provErr) {
                    res.json(provErr);
                    return;
                }

                conn.query('SELECT idCliente, codigo, nombre FROM cliente ORDER BY codigo, nombre', (cliErr, clientes) => {
                    if (cliErr) {
                        res.json(cliErr);
                        return;
                    }

                    conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo, nombre', (aniErr, animales) => {
                        if (aniErr) {
                            res.json(aniErr);
                            return;
                        }

                        res.render('compras_ventas_ganado', {
                            data: comprasVentas,
                            dataProveedor: proveedores,
                            dataCliente: clientes,
                            dataAnimal: animales
                        });
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

    if (data.idProveedor === '') {
        data.idProveedor = null;
    }

    if (data.idCliente === '') {
        data.idCliente = null;
    }

    if (data.fechaCompra === '') {
        data.fechaCompra = null;
    }

    if (data.fechaVenta === '') {
        data.fechaVenta = null;
    }

    if (data.precio === '') {
        data.precio = null;
    }

    if (data.precioTransporte === '') {
        data.precioTransporte = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('INSERT INTO compra_venta_ganado set ?', [data], (saveErr) => {
            if (saveErr) {
                res.json(saveErr);
                return;
            }
            res.redirect('/compras_ventas_ganado');
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
                cvg.*,
                DATE_FORMAT(cvg.fechaCompra, '%Y-%m-%d') AS ymdFechaCompra,
                DATE_FORMAT(cvg.fechaVenta, '%Y-%m-%d') AS ymdFechaVenta
            FROM compra_venta_ganado cvg
            WHERE cvg.idCompraVentaGanado = ?
        `, [id], (queryErr, compraVenta) => {
            if (queryErr) {
                res.json(queryErr);
                return;
            }

            conn.query('SELECT idProveedor, codigo, nombre FROM proveedor ORDER BY codigo, nombre', (provErr, proveedores) => {
                if (provErr) {
                    res.json(provErr);
                    return;
                }

                conn.query('SELECT idCliente, codigo, nombre FROM cliente ORDER BY codigo, nombre', (cliErr, clientes) => {
                    if (cliErr) {
                        res.json(cliErr);
                        return;
                    }

                    conn.query('SELECT idAnimal, codigo, nombre FROM animal ORDER BY codigo, nombre', (aniErr, animales) => {
                        if (aniErr) {
                            res.json(aniErr);
                            return;
                        }

                        res.render('compra_venta_ganado_edit', {
                            data: compraVenta[0],
                            dataProveedor: proveedores,
                            dataCliente: clientes,
                            dataAnimal: animales
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newCompraVenta = req.body;

    if (newCompraVenta.idProveedor === '') {
        newCompraVenta.idProveedor = null;
    }

    if (newCompraVenta.idCliente === '') {
        newCompraVenta.idCliente = null;
    }

    if (newCompraVenta.fechaCompra === '') {
        newCompraVenta.fechaCompra = null;
    }

    if (newCompraVenta.fechaVenta === '') {
        newCompraVenta.fechaVenta = null;
    }

    if (newCompraVenta.precio === '') {
        newCompraVenta.precio = null;
    }

    if (newCompraVenta.precioTransporte === '') {
        newCompraVenta.precioTransporte = null;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('UPDATE compra_venta_ganado set ? WHERE idCompraVentaGanado = ?', [newCompraVenta, id], (updateErr) => {
            if (updateErr) {
                res.json(updateErr);
                return;
            }
            res.redirect('/compras_ventas_ganado');
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

        conn.query('DELETE FROM compra_venta_ganado WHERE idCompraVentaGanado = ?', [id], (deleteErr) => {
            if (deleteErr) {
                res.json(deleteErr);
                return;
            }
            res.redirect('/compras_ventas_ganado');
        });
    });
};

module.exports = controller;
