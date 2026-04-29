const permissionService = require('../services/permissionService');

const controller = {};

const toBoolInt = (value) => {
    const normalize = (v) => {
        if (Array.isArray(v)) {
            if (v.length === 0) {
                return false;
            }
            return v.some((item) => normalize(item));
        }

        if (typeof v === 'boolean') {
            return v;
        }

        if (typeof v === 'number') {
            return v === 1;
        }

        if (typeof v === 'string') {
            const clean = v.trim().toLowerCase();
            return clean === '1' || clean === 'true' || clean === 'on' || clean === 'yes';
        }

        return false;
    };

    return normalize(value) ? 1 : 0;
};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        conn.query('SELECT idPerfil, codigo, nombre FROM perfil ORDER BY codigo, nombre', (perfilErr, perfiles) => {
            if (perfilErr) {
                res.json(perfilErr);
                return;
            }

            const selectedPerfilId = Number(req.query.idPerfil || (perfiles[0] ? perfiles[0].idPerfil : 0));
            conn.query('SELECT idModulo, clave, nombre, rutaBase FROM modulo_seguridad WHERE estado = 1 ORDER BY nombre', (modErr, modulos) => {
                if (modErr) {
                    res.json(modErr);
                    return;
                }

                conn.query(
                    'SELECT idModulo, puedeVer, puedeCrear, puedeEditar, puedeEliminar FROM perfil_modulo_permiso WHERE idPerfil = ?',
                    [selectedPerfilId],
                    (permErr, permisosRows) => {
                        if (permErr) {
                            res.json(permErr);
                            return;
                        }

                        const permisos = {};
                        (permisosRows || []).forEach((item) => {
                            permisos[item.idModulo] = {
                                puedeVer: Number(item.puedeVer) === 1,
                                puedeCrear: Number(item.puedeCrear) === 1,
                                puedeEditar: Number(item.puedeEditar) === 1,
                                puedeEliminar: Number(item.puedeEliminar) === 1
                            };
                        });

                        res.render('permisos', {
                            dataPerfiles: perfiles,
                            dataModulos: modulos,
                            dataPermisos: permisos,
                            selectedPerfilId,
                            message: req.query.ok ? 'Permisos actualizados correctamente.' : null
                        });
                    }
                );
            });
        });
    });
};

controller.save = (req, res) => {
    const idPerfil = Number(req.body.idPerfil || 0);
    let permisosForm = req.body.permiso || {};
    const moduloIdsRaw = req.body.moduloIds || [];
    const changedModuloIdsRaw = req.body.changedModuloIds || '';
    const permissionPayloadRaw = req.body.permissionPayload || '';

    if (permissionPayloadRaw) {
        try {
            const parsedPayload = JSON.parse(permissionPayloadRaw);
            if (parsedPayload && typeof parsedPayload === 'object') {
                permisosForm = parsedPayload;
            }
        } catch (payloadErr) {
            // invalid JSON, fall back to req.body.permiso
        }
    }

    const moduloIds = Array.isArray(moduloIdsRaw)
        ? moduloIdsRaw.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
        : [Number(moduloIdsRaw)].filter((id) => Number.isInteger(id) && id > 0);

    const uniqueModuloIds = [...new Set(
        (moduloIds.length > 0 ? moduloIds : Object.keys(permisosForm))
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0)
    )];

    const changedModuloIds = String(changedModuloIdsRaw)
        .split(',')
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isInteger(id) && id > 0);

    const targetIdsFromChanges = [...new Set(changedModuloIds)];
    const targetIds = targetIdsFromChanges.length > 0 ? targetIdsFromChanges : uniqueModuloIds;

    if (!idPerfil) {
        res.redirect('/permisos');
        return;
    }

    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }

        if (targetIds.length === 0) {
            res.redirect(`/permisos?idPerfil=${idPerfil}`);
            return;
        }

        conn.query('SELECT idModulo FROM modulo_seguridad WHERE estado = 1 AND idModulo IN (?)', [targetIds], (modErr, modulos) => {
            if (modErr) {
                res.json(modErr);
                return;
            }

                const targetModuloIds = (modulos || []).map((modulo) => Number(modulo.idModulo));

                if (targetModuloIds.length === 0) {
                    res.redirect(`/permisos?idPerfil=${idPerfil}`);
                    return;
                }

                conn.query(
                    `
                    SELECT idModulo, puedeVer, puedeCrear, puedeEditar, puedeEliminar
                    FROM perfil_modulo_permiso
                    WHERE idPerfil = ? AND idModulo IN (?)
                    `,
                    [idPerfil, targetModuloIds],
                    (currentErr, currentRows) => {
                        if (currentErr) {
                            res.json(currentErr);
                            return;
                        }

                        const currentMap = {};
                        (currentRows || []).forEach((row) => {
                            currentMap[Number(row.idModulo)] = {
                                puedeVer: Number(row.puedeVer),
                                puedeCrear: Number(row.puedeCrear),
                                puedeEditar: Number(row.puedeEditar),
                                puedeEliminar: Number(row.puedeEliminar)
                            };
                        });

                        const inserts = [];
                        const updates = [];

                        targetModuloIds.forEach((idModulo) => {
                            const hasRow = Object.prototype.hasOwnProperty.call(permisosForm, String(idModulo));
                            const row = hasRow ? permisosForm[String(idModulo)] : null;
                            const actual = currentMap[idModulo];

                            if (!hasRow) {
                                // If a module did not come in payload, keep current DB values.
                                return;
                            }

                            const nuevo = {
                                puedeVer: typeof row.ver === 'undefined' ? (actual ? actual.puedeVer : 0) : toBoolInt(row.ver),
                                puedeCrear: typeof row.crear === 'undefined' ? (actual ? actual.puedeCrear : 0) : toBoolInt(row.crear),
                                puedeEditar: typeof row.editar === 'undefined' ? (actual ? actual.puedeEditar : 0) : toBoolInt(row.editar),
                                puedeEliminar: typeof row.eliminar === 'undefined' ? (actual ? actual.puedeEliminar : 0) : toBoolInt(row.eliminar)
                            };

                            if (!actual) {
                                inserts.push([idPerfil, idModulo, nuevo.puedeVer, nuevo.puedeCrear, nuevo.puedeEditar, nuevo.puedeEliminar]);
                                return;
                            }

                            const changed =
                                actual.puedeVer !== nuevo.puedeVer ||
                                actual.puedeCrear !== nuevo.puedeCrear ||
                                actual.puedeEditar !== nuevo.puedeEditar ||
                                actual.puedeEliminar !== nuevo.puedeEliminar;

                            if (changed) {
                                updates.push([
                                    nuevo.puedeVer,
                                    nuevo.puedeCrear,
                                    nuevo.puedeEditar,
                                    nuevo.puedeEliminar,
                                    idPerfil,
                                    idModulo
                                ]);
                            }
                        });

                        conn.beginTransaction((txErr) => {
                            if (txErr) {
                                res.json(txErr);
                                return;
                            }

                            const runUpdates = (index) => {
                                if (index >= updates.length) {
                                    conn.commit((commitErr) => {
                                        if (commitErr) {
                                            conn.rollback(() => res.json(commitErr));
                                            return;
                                        }

                                        if (req.session && req.session.user && Number(req.session.user.idPerfil) === idPerfil) {
                                            permissionService.loadProfilePermissions(conn, idPerfil, (permErr, permissionMap) => {
                                                req.session.permissionMap = permErr ? {} : permissionMap;
                                                req.session.save(() => {
                                                    res.redirect(`/permisos?idPerfil=${idPerfil}&ok=1`);
                                                });
                                            });
                                            return;
                                        }

                                        res.redirect(`/permisos?idPerfil=${idPerfil}&ok=1`);
                                    });
                                    return;
                                }

                                conn.query(
                                    `
                                    UPDATE perfil_modulo_permiso
                                    SET puedeVer = ?, puedeCrear = ?, puedeEditar = ?, puedeEliminar = ?
                                    WHERE idPerfil = ? AND idModulo = ?
                                    `,
                                    updates[index],
                                    (updateErr) => {
                                        if (updateErr) {
                                            conn.rollback(() => res.json(updateErr));
                                            return;
                                        }

                                        runUpdates(index + 1);
                                    }
                                );
                            };

                            if (inserts.length > 0) {
                                conn.query(
                                    `
                                    INSERT INTO perfil_modulo_permiso
                                    (idPerfil, idModulo, puedeVer, puedeCrear, puedeEditar, puedeEliminar)
                                    VALUES ?
                                    `,
                                    [inserts],
                                    (insertErr) => {
                                        if (insertErr) {
                                            conn.rollback(() => res.json(insertErr));
                                            return;
                                        }

                                        runUpdates(0);
                                    }
                                );
                                return;
                            }

                            runUpdates(0);
                        });
                    }
                );
        });
    });
};

module.exports = controller;
