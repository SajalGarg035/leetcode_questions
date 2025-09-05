const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { email: "admin@gmail.com", iat: 1757092298 },
  "secret",                 // the known signing key
  { algorithm: "HS256" }
);

console.log(token);
