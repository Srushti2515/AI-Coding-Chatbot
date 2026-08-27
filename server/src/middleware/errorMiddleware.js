export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error Handler] ${err.message}`);
  
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server. Please try again.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
