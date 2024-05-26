function apiKeyMiddleware(req, res, next) {
    const providedApiKey = req.headers["x-api-key"];
  
    if (!providedApiKey || providedApiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    next();
  }
  
  module.exports = apiKeyMiddleware;
  