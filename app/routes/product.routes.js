module.exports = app => {
    const product = require("../controllers/product.controller.js");

    app.get("/products", product.findAll);
    app.get("/products", product.findById);
}  