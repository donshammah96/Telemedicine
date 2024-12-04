const notFound = (req, res, next) => {
    const error = new Error('Resource not found.');
    error.status = 404;
    next(error);
};

export default (req, res, next) => {
    console.error(`Resource not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Resource not found', path: req.originalUrl });
};
