const requestTimeMiddleware = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const elapsed = process.hrtime(start);
        const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
        console.log(`Request ${req.method} ${req.url} took ${elapsedMs.toFixed(2)} ms`);
    });
    next();
};

module.exports = requestTimeMiddleware;