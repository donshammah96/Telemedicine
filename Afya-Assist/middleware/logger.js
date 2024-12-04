import colors from 'colors';

const logger = (req, res, next) => {
    const methodColor = {
        GET: 'blue',
        POST: 'yellow',
        PUT: 'green',
        DELETE: 'red'
    }

    const color = methodColor[req.method] || 'magenta';

    console.log(
        `${req.method} ${req.protocol}:// 
         ${req.get('host')} ${req.originalUrl} 
         ${new Date()}` [
            color
         ]);
    next();
}

export default logger;