export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || (error.name === "ValidationError" ? 400 : 500);

  res.status(status).json({
    message: error.message || "Server error",
    errors: formatValidationErrors(error)
  });
}

function formatValidationErrors(error) {
  if (error.name !== "ValidationError") return undefined;

  return Object.values(error.errors).map((item) => item.message);
}
