const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'Something went wrong.',
        status: err.status || 500
    });    
};

export default errorHandler;