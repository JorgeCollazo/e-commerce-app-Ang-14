const { expressjwt: jwt } = require("express-jwt");      // This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;     // You can now call your .env variables
    return jwt({
        secret,
        algorithms: ['HS256'],       // Algorithms to be used, check the jwt.io website
        isRevoked: isRevoked
    }).unless({              // All these routes don't need token (The user doesnt have to be authenticated to see them)'
        path: [
            // { url: `${api}/products`, methods: ['GET', 'OPTIONS'] },
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },   // Using a regexp to accept multiple endpoints you can check regexp here https://regex101.com/
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },   // Using a regexp to accept multiple endpoints you can check regexp here https://regex101.com/
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },   // Using a regexp to accept multiple endpoints you can check regexp here https://regex101.com/
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/users/get/count`,
        ]
    })
}

async function isRevoked(req, token, done) {          // payload is the data inside the user
    return !token.payload.isAdmin;                  // If the user is not Admin the request is revoked
}

module.exports = authJwt;


