module.exports = app => {
    const product = require("../controllers/product.controller.js");

    app.get("/product", product.findAll);

}  