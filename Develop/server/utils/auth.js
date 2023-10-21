// Import the necessary library for working with JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Define the secret and expiration for JWTs
const secret = 'mysecretsshhhhh'; // Secret key used to sign and verify tokens
const expiration = '2h'; // Expiration time for tokens (2 hours)

module.exports = {
  // Middleware function to authenticate routes
  authMiddleware: function ({ req }) {
    // Retrieve the token from the request, which can be sent via body, query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If the token is sent via headers, extract it
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim(); // Remove 'Bearer' prefix
    }

    // If no token is found, return the original request
    if (!token) {
      return req;
    }

    // Verify the token and extract user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach user data to the request object
    } catch {
      console.log('Invalid token'); // Handle token verification errors
    }

    // Return the updated request
    return req;
  },

  // Function to sign a JWT token
  signToken: function ({ username, email, _id }) {
    // Define the payload containing user information
    const payload = { username, email, _id };

    // Sign the token using the secret and set the expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
