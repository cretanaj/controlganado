const ROUTE_MODULE_MAP = {
    '': 'inicio',
    animales: 'animales',
    movimiento_hatos: 'movimiento_hatos',
    palpaciones: 'palpaciones',
    partos: 'partos',
    control_actividades: 'control_actividades',
    control_paquetes: 'control_paquetes',
    notificaciones_resumen: 'notificaciones_resumen',
    notificaciones: 'notificaciones',
    perfiles: 'perfiles',
    usuarios: 'usuarios',
    asignacion_fincas: 'asignacion_fincas',
    inventarios: 'inventarios',
    celos: 'celos',
    sintomas_bovinos: 'sintomas_bovinos',
    pesajes: 'pesajes',
    compras_ventas_ganado: 'compras_ventas_ganado',
    tareas: 'tareas',
    vacunaciones: 'vacunaciones',
    google_maps: 'google_maps',
    aretes: 'aretes',
    razas: 'razas',
    colores: 'colores',
    ciclovitales: 'ciclovitales',
    estado_palpaciones: 'estado_palpaciones',
    estado_partos: 'estado_partos',
    estado_animales: 'estado_animales',
    estado_tareas: 'estado_tareas',
    enfermedades: 'enfermedades',
    tipo_notificaciones: 'tipo_notificaciones',
    fincas: 'fincas',
    hatos: 'hatos',
    veterinarios: 'veterinarios',
    colaboradores: 'colaboradores',
    proveedores: 'proveedores',
    clientes: 'clientes',
    productos: 'productos',
    paquetes: 'paquetes',
    actividades: 'actividades',
    permisos: 'permisos'
};

const buildPermissionMap = (rows) => {
    const map = {};
    (rows || []).forEach((row) => {
        map[row.clave] = {
            ver: Number(row.puedeVer) === 1,
            crear: Number(row.puedeCrear) === 1,
            editar: Number(row.puedeEditar) === 1,
            eliminar: Number(row.puedeEliminar) === 1
        };
    });
    return map;
};

const loadProfilePermissions = (conn, idPerfil, callback) => {
    if (!idPerfil) {
        callback(null, {});
        return;
    }

    conn.query(
        `
        SELECT ms.clave, pmp.puedeVer, pmp.puedeCrear, pmp.puedeEditar, pmp.puedeEliminar
        FROM perfil_modulo_permiso pmp
        INNER JOIN modulo_seguridad ms ON ms.idModulo = pmp.idModulo
        WHERE pmp.idPerfil = ?
        `,
        [idPerfil],
        (err, rows) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null, buildPermissionMap(rows));
        }
    );
};

const getModuleFromRequestPath = (pathValue) => {
    const cleanPath = (pathValue || '').split('?')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    if (segments.length === 0) {
        return ROUTE_MODULE_MAP[''];
    }

    return ROUTE_MODULE_MAP[segments[0]] || null;
};

const getActionFromRequest = (req) => {
    const method = (req.method || 'GET').toUpperCase();
    const cleanPath = (req.path || '').toLowerCase();

    if (cleanPath.includes('/delete')) {
        return 'eliminar';
    }

    if (cleanPath.includes('/update')) {
        return 'editar';
    }

    if (cleanPath.includes('/add') || cleanPath.includes('/import')) {
        return 'crear';
    }

    if (method === 'DELETE') {
        return 'eliminar';
    }

    if (method === 'PUT' || method === 'PATCH') {
        return 'editar';
    }

    if (method === 'POST') {
        return 'crear';
    }

    return 'ver';
};

const hasPermission = (permissionMap, moduleKey, action, user) => {
    if (!moduleKey || !action) {
        return true;
    }

    // Permiso especial desactivado: ADM ya no omite la matriz de permisos.
    // if (user && user.codigoPerfil === 'ADM') {
    //     return true;
    // }

    if (!permissionMap || !permissionMap[moduleKey]) {
        return false;
    }

    return permissionMap[moduleKey][action] === true;
};

module.exports = {
    ROUTE_MODULE_MAP,
    buildPermissionMap,
    loadProfilePermissions,
    getModuleFromRequestPath,
    getActionFromRequest,
    hasPermission
};
