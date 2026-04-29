const permissionService = require('../services/permissionService');

const PUBLIC_PREFIXES = [
    '/login',
    '/auth/login',
    '/css',
    '/js',
    '/img',
    '/fonts',
    '/expo-assets',
    '/favicon.ico'
];

const isPublicPath = (pathValue) => PUBLIC_PREFIXES.some((prefix) => pathValue === prefix || pathValue.startsWith(`${prefix}/`));

const sanitizeNext = (nextPath) => {
    if (!nextPath || typeof nextPath !== 'string') {
        return '/';
    }

    if (!nextPath.startsWith('/') || nextPath.startsWith('//')) {
        return '/';
    }

    if (nextPath.startsWith('/auth') || nextPath.startsWith('/login')) {
        return '/';
    }

    return nextPath;
};

const attachSecurityContext = (req, res, next) => {
    res.locals.currentUser = req.session && req.session.user ? req.session.user : null;
    res.locals.can = (moduleKey, action = 'ver') => permissionService.hasPermission(req.session ? req.session.permissionMap : null, moduleKey, action, res.locals.currentUser);
    next();
};

const requireAuthAndAuthorize = (req, res, next) => {
    const pathValue = req.path || req.originalUrl || '/';

    if (isPublicPath(pathValue)) {
        next();
        return;
    }

    if (pathValue === '/auth/logout') {
        next();
        return;
    }

    if (!req.session || !req.session.user) {
        res.redirect(`/login?next=${encodeURIComponent(sanitizeNext(req.originalUrl || '/'))}`);
        return;
    }

    const moduleKey = permissionService.getModuleFromRequestPath(pathValue);
    const action = permissionService.getActionFromRequest(req);
    const isAllowed = permissionService.hasPermission(req.session.permissionMap, moduleKey, action, req.session.user);

    if (!isAllowed) {
        res.status(403).render('forbidden', {
            message: 'No tiene permisos para acceder a este recurso.'
        });
        return;
    }

    next();
};

module.exports = {
    attachSecurityContext,
    requireAuthAndAuthorize,
    sanitizeNext
};
