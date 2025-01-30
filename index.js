/* 
  This is a simple CORS middleware function that can be used in any Express.js application.
  */
function cors(options = {}) {
  // Default options
  const defaultOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    headers: "*",
    credentials: false,
  };
  // Merge default options with user options
  const corsOptions = { ...defaultOptions, ...options };
  return (req, res, next) => {
    const requestOrigin = req.headers.origin;
    // Validate methods array
    let validMethods = [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS",
    ];
    corsOptions.methods = corsOptions.methods.filter((method) =>
      validMethods.includes(method.toUpperCase())
    );
    // Set Access-Control-Allow-Methods
    if (corsOptions.methods && corsOptions.methods.length) {
      res.setHeader(
        "Access-Control-Allow-Methods",
        corsOptions.methods.join(", ")
      );
    }
    if (req.method !== "OPTIONS" && !corsOptions.methods.includes(req.method)) {
      res.status(405).send(`Method ${req.method} Not Allowed`);
    }
    // Set Access-Control-Allow-Origin
    if (typeof corsOptions.origin === "string" && corsOptions.origin === "*") {
      res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
    }
    if (Array.isArray(corsOptions.origin)) {
      if (corsOptions.origin.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      }
    }
    // Set Access-Control-Allow-Headers
    res.setHeader("Access-Control-Allow-Headers", corsOptions.headers);
    // Set Access-Control-Allow-Credentials
    if (corsOptions.credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    // Call the next middleware
    next();
  };
}
// Export the cors function
module.exports = cors;
