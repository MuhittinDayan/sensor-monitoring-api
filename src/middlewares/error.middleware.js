//  404 ERROR HANDLER
export const notFoundHandler = ((_req, res) => {
    return res.status(404).json({
        message: "Route not found"
    })
});



// GLOBAL ERROR HANDLER
export const errorHandler = ((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ")

        return res.status(400).json({ message });
    }
    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid ID format." });
    }
    const message = statusCode >= 500
        ? "An unexpected error occurred."
        : err.message;

    return res.status(statusCode).json({ message });
});