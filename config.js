/* global module, process */

module.exports = {
    database: "mongodb://localhost/elearning",
    port: process.env.PORT || 3000,
    secretKey: "superdupersecret"
};