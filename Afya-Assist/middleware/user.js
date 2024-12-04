const setUserInView = (req, res, next) => {
    console.log('Session:', req.session);
    console.log('User in session:', req.session ? req.session.user : null);
    res.locals.user = req.session && req.session.user ? req.session.user : {};
    next();
};

export default (req, res, next) => {
    const isStaticFile = req.path.match(/^\/(css|js|img|favicon.ico)/);
    if (isStaticFile) return next();

    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
};
