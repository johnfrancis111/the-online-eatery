/**
 * Wraps an async Express route handler so any thrown error / rejected promise
 * is forwarded to next(), letting the centralized errorHandler deal with it.
 * Avoids repeating try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
