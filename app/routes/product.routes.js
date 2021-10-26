module.exports = app => {
    const product = require("../controllers/product.controller.js");

    app.get("/products", product.findAll);
    app.get("/products/:productId", product.findOne);
    app.post("/products/create", product.create);
    // app.put("/products/:productId", product.update);
    app.delete("/products/:productId", product.delete);
}  